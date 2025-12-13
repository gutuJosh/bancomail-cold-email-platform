"use client";
import React, { useState, useEffect, useRef, FC, ChangeEvent } from "react";
import styles from "../../app/campaigns/new/new.module.scss";
import { DelieveryTimeProps } from "@/types/global";

interface RangeProps {
  from: string;
  to: string;
}

interface Props {
  day: string;
  callBack: (obj: DelieveryTimeProps) => void;
  defaultValue?: undefined | RangeProps[];
}

const DeliveryTime: FC<Props> = ({ day, callBack, defaultValue }) => {
  const [range, setRange] = useState<RangeProps[]>(
    defaultValue !== undefined ? defaultValue : [{ from: "", to: "" }]
  );

  const inputStartRefs = useRef<HTMLInputElement[]>([]);
  const inputEndRefs = useRef<HTMLInputElement[]>([]);
  const checkbox = useRef<HTMLInputElement>(null);

  const addRange = () => {
    if (checkbox.current && !checkbox.current.checked) {
      return;
    }
    const items = [...range];

    if (range.length < 3) {
      items.push({
        from: "",
        to: "",
      });
    }
    setRange(items);
  };

  const activateDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setRange([{ from: "", to: "" }]);
      callBack({
        dayName: day,
        hours: [{ from: "", to: "" }],
      });
    }
  };

  useEffect(() => {
    const items = range.filter(
      (item) => item.from.length > 0 && item.to.length > 0
    );

    callBack({
      dayName: day,
      hours: items,
    });
  }, [range]);

  return (
    <div className="flex flex-align-center">
      <div className="uppercase">
        <input
          ref={checkbox}
          type="checkbox"
          name={day}
          defaultChecked={defaultValue !== undefined ? true : false}
          title="Select day"
          value={day}
          onChange={(e) => activateDate(e)}
        />
        <label htmlFor={day}>{day}</label>
      </div>

      <div className={`flex flex-column`}>
        {range.map((item, index) => (
          <div className="flex flex-align-center" key={`${day}_${index + 1}`}>
            <div className={styles.formGroup}>
              <label htmlFor={`${day}_start_${index + 1}`}>From</label>

              <input
                className={styles.input}
                type="time"
                id={`${day}_start_${index + 1}`}
                min="00:00"
                max="23:59"
                onChange={(e) => {
                  const input = [...range];
                  input[index].from = e.target.value;
                  setRange(input);
                }}
                onBlur={(e) => {
                  if (!checkbox.current?.checked) {
                    const input = [...range];
                    input[index].from = "";
                    setRange(input);
                    return;
                  }
                }}
                value={range[index].from}
                ref={(element) => {
                  if (element) {
                    inputStartRefs.current[inputStartRefs.current.length] =
                      element;
                  }
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor={`${day}_end_${index + 1}`}>To</label>

              <input
                className={styles.input}
                type="time"
                id={`${day}_end_${index + 1}`}
                min="00:00"
                max="23:59"
                onChange={(e) => {
                  const input = [...range];
                  input[index].to = e.target.value;
                  setRange(input);
                }}
                onBlur={(e) => {
                  if (!checkbox.current?.checked) {
                    const input = [...range];
                    input[index].to = "";
                    setRange(input);
                    return;
                  }
                }}
                value={range[index].to}
                ref={(element) => {
                  if (element) {
                    inputEndRefs.current[inputStartRefs.current.length] =
                      element;
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            addRange();
          }}
        >
          Add +
        </button>
      </div>
    </div>
  );
};
export default DeliveryTime;
