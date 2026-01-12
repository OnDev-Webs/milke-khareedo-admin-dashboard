"use client";

import { Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { City } from "country-state-city";

export default function CitySelect({ control }: { control: any }) {
  // 👇 fallback added
  const cities = City.getCitiesOfCountry("IN") ?? [];

  const options = cities.map((c) => ({
    label: c.name,
    value: c.name,
  }));

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <CreatableSelect
          {...field}
          options={options}
          isSearchable
          isClearable
          placeholder="Select or Search Your City Name"
          value={
            field.value
              ? { label: field.value, value: field.value }
              : null
          }
          onChange={(opt) => field.onChange(opt?.value)}
          className="text-sm"
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              minHeight: "36px",
            }),
          }}
        />
      )}
    />
  );
}
