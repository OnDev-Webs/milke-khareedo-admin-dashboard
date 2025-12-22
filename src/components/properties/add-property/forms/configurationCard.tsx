import CustomDropdown from "@/components/custom/dropdawn";
import { Minus, Plus, Trash } from "lucide-react";
import { useFieldArray, useWatch } from "react-hook-form";

export function ConfigurationCard({
  index,
  control,
  register,
  setValue,
  removeConfig,
}: {
  index: number;
  control: any;
  register: any;
  setValue: any;
  removeConfig: (index: number) => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `configurations.${index}.subConfiguration`,
  });

  const unitType = useWatch({
    control,
    name: `configurations.${index}.unitType`,
  });

  const bhkOptions = [
    "1 BHK",
    "1.5 BHK",
    "2 BHK",
    "2.5 BHK",
    "3 BHK",
    "3.5 BHK",
    "4 BHK",
    "4.5 BHK",
    "5.5 BHK",
    "6 BHK",
    "6.5 BHK",
    "7 BHK",
  ];

  console.log("fields", fields);

  return (
    <div className="mt-5 border rounded-xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <CustomDropdown
          items={bhkOptions}
          placeholder="Select Configuration"
          onSelect={(item) => {
            if (typeof item === "string") {
              setValue(`configurations.${index}.unitType`, item, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }
          }}
        />

        <div className="flex gap-4 flex-row">
          {unitType && (
            <div className=" flex gap-4">
              <button
                type="button"
                onClick={() =>
                  append({
                    carpetArea: "",
                    price: "",
                  })
                }
                className="px-4 py-1 border border-dashed flex items-center gap-2 rounded-md text-sm"
              >
                Add Sub-Configuration <Plus size={16} />
              </button>
            </div>
          )}
          <button
                type="button"
                onClick={() => removeConfig(index)}
                className="bg-orange-500 p-2 rounded-md text-white"
              >
                <Trash size={16} />
              </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map((_, subIndex) => (
          <div
            key={_.id}
            className="relative border rounded-lg p-3 flex gap-3 items-end"
          >
            <input
              {...register(
                `configurations.${index}.subConfiguration.${subIndex}.carpetArea`
              )}
              placeholder="Carpet Area (ft²)"
              className="border px-3 py-2 rounded-md w-full"
            />

            <input
              {...register(
                `configurations.${index}.subConfiguration.${subIndex}.price`
              )}
              placeholder="Price"
              className="border px-3 py-2 rounded-md w-full"
            />

            <button
              type="button"
              onClick={() => remove(subIndex)}
              className="absolute -top-1 -right-2 rounded-full bg-red-500 p-1 text-white"
            >
              <Minus size={10} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
