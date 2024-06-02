"use client";
import { useState } from 'react';
import { Input, Button, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';

const InsertDataPage = () => {
  const [formData, setFormData] = useState({
    crimeData: {
      date_rptd: '',
      date_occ: '',
      crm_desc: '',
      location: '',
      weapon_desc: '',
      lat: '',
      lon: '',
      investigator_id: '',
      case_id: '',
    },
    evidence: {
      evidence_id: '',
      date_acquired: '',
      case_id: '',
      weapon_desc: '',
    },
    investigator: {
      investigator_id: '',
      name: '',
      date_of_birth: '',
      department: '',
      case_id: '',
    },
    suspect: {
      suspect_id: '',
      name: '',
      dob: '',
      case_id: '',
    },
    witness: {
      witness_id: '',
      name: '',
      dob: '',
      case_id: '',
    },
  });

  const handleSubmit = async () => {
    try {
      // Send POST requests for each table
      for (const table in formData) {
        const response = await fetch(`http://localhost:8000/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData[table]),
        });
        if (response.ok) {
          console.log(`Data inserted successfully into ${table} table`);
          // Clear form data after successful insertion
          setFormData({ ...formData, [table]: {} });
        } else {
          console.error(`Failed to insert data into ${table} table: ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const handleChange = (table, fieldName, value) => {
    setFormData({
      ...formData,
      [table]: {
        ...formData[table],
        [fieldName]: value,
      },
    });
  };

  return (
    <div>
      <h1>Insert Data Page</h1>
      {/* Form for inserting data into all tables */}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((table) => (
          <FormControl key={table} mt={4}>
            <h2>{table.replace(/_/g, ' ').toUpperCase()}</h2>
            {Object.keys(formData[table]).map((fieldName) => (
              <FormControl key={fieldName} id={`${table}-${fieldName}`}>
                <FormLabel>{fieldName.replace(/_/g, ' ').toUpperCase()}</FormLabel>
                <Input
                  value={formData[table][fieldName]}
                  className="bg-black text-green-500"
                  onChange={(e) => handleChange(table, fieldName, e.target.value)}
                />
              </FormControl>
            ))}
            {/* Add validation using FormErrorMessage */}
            {/* ... */}
            {Object.keys(formData[table]).map((fieldName) => (
              <FormErrorMessage key={fieldName}>
                {formData[table].validationErrors &&
                  formData[table].validationErrors[fieldName]}
              </FormErrorMessage>
            ))}
          </FormControl>
        ))}
        <Button type="submit" mt={4}>Submit Data</Button>
      </form>
    </div>
  );
};

export default InsertDataPage;
