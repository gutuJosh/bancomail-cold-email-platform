"use client";
import { useState, useRef, FC } from "react";
import styles from "../../app/campaigns/new/new.module.scss";

interface Props {
  [id: string]: { from: string; to: string };
}

const DeliveryTime: FC<{ day: string }> = ({ day }) => {
  const [range, setRange] = useState<Props[]>([
    {
      [`${day}_1`]: { from: "09:00", to: "12:00" },
    },
  ]);

  const inputStartRefs = useRef<HTMLInputElement[]>([]);
  const inputEndRefs = useRef<HTMLInputElement[]>([]);

  const addRange = () => {
    const items = [...range];

    if (range.length < 3) {
      items.push({
        [`${day}_${items.length + 1}`]: {
          from: "09:00",
          to: "12:00",
        },
      });
    }
    setRange(items);
  };

  return (
    <div className="flex flex-align-center">
      <div className="uppercase">{day}</div>

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
                  input[index][`${day}_${index + 1}`].from = e.target.value;
                  setRange(input);
                }}
                defaultValue={range[index][`${day}_${index + 1}`].from}
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
                  input[index][`${day}_${index + 1}`].to = e.target.value;
                  setRange(input);
                }}
                defaultValue={range[index][`${day}_${index + 1}`].to}
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
