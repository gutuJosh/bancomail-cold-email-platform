import Papa from 'papaparse';

export interface ProspectCSVRow {
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
}

export const parseCSV = (file: File): Promise<ProspectCSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validProspects = results.data.filter((row: any) => {
          return row.email && row.first_name && row.last_name;
        }) as ProspectCSVRow[];
        
        resolve(validProspects);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const validateProspects = (prospects: ProspectCSVRow[]): { valid: ProspectCSVRow[]; errors: string[] } => {
  const valid: ProspectCSVRow[] = [];
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  prospects.forEach((prospect, index) => {
    if (!prospect.email) {
      errors.push(`Row ${index + 1}: Email is required`);
    } else if (!emailRegex.test(prospect.email)) {
      errors.push(`Row ${index + 1}: Invalid email format (${prospect.email})`);
    } else if (!prospect.first_name) {
      errors.push(`Row ${index + 1}: First name is required`);
    } else if (!prospect.last_name) {
      errors.push(`Row ${index + 1}: Last name is required`);
    } else {
      valid.push(prospect);
    }
  });

  return { valid, errors };
};
