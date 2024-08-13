import React, { useState } from "react";
import Select from "react-select";

const MultiSelectDropdown = ({ options, onChange }) => {
  const allOption = { value: "all", label: "Select All" };

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    // Check if the "Select All" option was clicked
    if (selected.some((option) => option.value === allOption.value)) {
      // If already all selected, remove all
      if (selectedOptions.length === options.length - 1) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(options.filter((option) => option.value !== allOption.value));
      }
    } else {
      setSelectedOptions(selected);
    }
    onChange(selected);
  };

  const isAllSelected = selectedOptions.length === options.length - 1;

  return (
    <div>
      <Select
        options={options}
        isMulti
        value={isAllSelected ? options.filter((option) => option.value !== allOption.value) : selectedOptions}
        onChange={handleChange}
        placeholder="Select Class..."
      />
    </div>
  );
};

export default MultiSelectDropdown;

