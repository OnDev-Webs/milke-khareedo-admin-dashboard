"use client";

import { useEffect, useState } from "react";
import AddProjectOverviewForm from "./forms/projectOverviewForm";
import AddHighlightsForm from "./forms/highlightFrom";
import AddProjectPhotoUpload from "./forms/graphicsForm";
import AddAmenitiesForm from "./forms/amenitiesForm";
import AddLayoutPlanForm from "./forms/layoutPlanForm";
import AddRelationshipManagerForm from "./forms/relationshipManager";
import ConnectivityForm from "./forms/connectivityForm";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { FormProvider } from "react-hook-form";
import { useAppDispatch } from "@/lib/store/hooks";
import { createProperty } from "@/lib/features/properties/propertiesApi";
import { PropertyFormValues } from "@/schema/property/propertySchema";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchPropertyById, updateProperty } from "@/lib/features/properties/propertiesApi";


type Step = {
  id: number;
  step: number;
  title: string;
  description: string;
  guidelines: List[];
  component: React.ReactNode;
};

type List = {
  title: string;
  list: string[];
};

export default function AddNewProperty() {
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const mode = searchParams.get("mode"); 
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const newProperty: Step[] = [
    {
      id: 1,
      step: 1,
      title: "Project Overview",
      description:
        "Add core project information to create your listing foundation.",
      component: <AddProjectOverviewForm />,
      guidelines: [
        {
          title: "Data Guidelines",
          list: [
            "Use accurate project details as per developer documents.",
            "Keep names, prices, and dates consistent with RERA or official brochures.",
            "Double-check spellings and numeric values before saving.",
          ],
        },
      ],
    },
    {
      id: 2,
      step: 2,
      title: "Graphics",
      description:
        "Upload high-quality images for this project. The photos you add here will appear in the Project Gallery on the client-facing website and marketing pages.",
      component: <AddProjectPhotoUpload />,
      guidelines: [
        {
          title: "Quality Tips",
          list: [
            "Upload 15–20 photos for best presentation.",
            "Cover all key spaces — towers, amenities, interiors, exteriors.",
            "Add 2–4 angles of every major area for better clarity.",
          ],
        },
        {
          title: "Preferred Cover Image",
          list: [
            "The 1st image is used as the Preferred Cover Image. You can reorder Graphics anytime by dragging.",
          ],
        },
        {
          title: "Sorting & Management",
          list: ["Drag photos to reorder.", " Remove unwanted images anytime."],
        },
      ],
    },
    {
      id: 3,
      step: 3,
      title: "Highlights",
      description:
        "Add key selling points that make the project stand out. These will appear on the listing page and in marketing sections.",
      component: <AddHighlightsForm />,
      guidelines: [
        {
          title: "Guidelines",
          list: [
            "Keep each point short and clear.",
            "Focus on USPs: approvals, amenities, planning, infrastructure.",
            "Add 4–8 highlights for best presentation.",
          ],
        },
        {
          title: "Quality Tips",
          list: [
            "Use simple language (no long paragraphs).",
            "Avoid repeating the same point.",
            "Use real, verifiable project features.",
          ],
        },
      ],
    },
    {
      id: 4,
      step: 4,
      title: "Amenities",
      description:
        "Add all amenities offered in the project. These will be displayed on the project detail page for buyers to understand the lifestyle and facilities available.",
      component: <AddAmenitiesForm />,
      guidelines: [
        {
          title: "Input Guidelines",
          list: [
            "Use simple, clear names (e.g., Swimming Pool, Club House, Yoga Room).",
            "Add amenities one by one using the field above.",
            "You can edit or remove amenities anytime.",
          ],
        },
      ],
    },
    {
      id: 5,
      step: 5,
      title: "Layout plan",
      description:
        "Upload floor plan images for each configuration. Sizes and prices are already pulled from Project Overview.",
      component: <AddLayoutPlanForm />,
      guidelines: [
        {
          title: "What You Need To Do",
          list: [
            "Add floor plan photos only.",
            "Ensure labels, dimensions, and layout details are clearly visible in the image.",
            "Upload one or more plans per configuration.",
          ],
        },
      ],
    },
    {
      id: 6,
      step: 6,
      title: "Connectivity",
      description:
        "Add the project’s main location and surrounding points of interest. This helps buyers understand access, convenience, and overall livability.",
      component: <ConnectivityForm />,
      guidelines: [
        {
          title: "Project Location",
          list: [
            "Pin the exact project location on the map.",
            "Search or drag the pin to adjust the position.",
          ],
        },
        {
          title: "Nearby Connectivity",
          list: [
            "Search for nearby places and select them from suggestions. Add schools, hospitals, transport hubs, and restaurants around the project.",
          ],
        },
      ],
    },
    {
      id: 7,
      step: 7,
      title: "Relationship Manager",
      description:
        "Assign the primary RM and supporting sales agents for this project. These members will receive and manage incoming leads.",
      component: <AddRelationshipManagerForm />,
      guidelines: [
        {
          title: "Primary RM",
          list: [
            "Select one Relationship Manager who will be the main point of contact for this project.",
          ],
        },
        {
          title: "Lead Distribution",
          list: [
            "Optionally add additional sales agents. Leads will be shared with all assigned agents based on your internal distribution logic.",
          ],
        },
        {
          title: "How It Works",
          list: [
            "Search team members by typing at least 3 characters.",
            "Select from the suggested list.",
            "Remove or change assignments anytime.",
          ],
        },
      ],
    },
  ];

  const totalSteps = newProperty.length;

  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const currentStep = newProperty.find((item) => item.step === activeStep);

  const methods = usePropertyForm();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!propertyId) return;

    dispatch(fetchPropertyById(propertyId)).then((res: any) => {
      const property = res.payload;
      console.log("property is :-", property);
      if (!property) return;

      methods.reset(property);

      if (property.developer?._id) {
        methods.setValue("developer", property.developer._id);
      }

      if (property.location) {
        methods.setValue("location", property.location);
      }

      if (property.configurations?.length) {
        methods.setValue("configurations", property.configurations);
      }

      if (property.connectivity) {
        methods.setValue("connectivity", property.connectivity);
      }
    });
  }, [propertyId]);

  useEffect(() => {
    if (!propertyId) return;

    dispatch(fetchPropertyById(propertyId)).then((res: any) => {
      const data = res.payload;
      if (!data) return;

      methods.reset({
        ...data,
        images: data.images?.map((img: any) => img.url) || [],
      });
    });
  }, [propertyId]);


  const { handleSubmit } = methods;

  const onSubmit = async (data: PropertyFormValues) => {
    if (isViewMode) return;
    const formData: any = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        key === "images" ||
        key === "layouts" ||
        value === undefined ||
        value === null
      ) {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (data.images?.length) {
      data.images.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    Object.entries(data.layouts || {}).forEach(([layoutKey, files]) => {
      const [unitType, carpetAreaRaw] = layoutKey.split("_");
      const carpetArea = Math.floor(Number(carpetAreaRaw) / 100 || Number(carpetAreaRaw));
      const finalKey = `${unitType}_${carpetArea}`;
      files.forEach((file) => {
        formData.append(`layout_${finalKey}`, file);
      });
    });

    const resultAction = isEditMode && propertyId
      ? await dispatch(updateProperty({ id: propertyId, payload: formData }))
      : await dispatch(createProperty(formData));

    if (
      createProperty.fulfilled.match(resultAction) ||
      updateProperty.fulfilled.match(resultAction)
    ) {
      router.push("/properties");
    }
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" h-full  grid grid-cols-24">
            <aside className="col-span-5 border-r h-[92.1vh]  bg-white p-4 flex flex-col justify-between">
              <div>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  {currentStep?.title}
                </h3>

                <ul className=" mb-4 space-y-2 text-xs text-gray-500 list-disc pl-4">
                  <li>{currentStep?.description}</li>
                </ul>

                <div className="border-t pt-4 space-y-2">
                  {currentStep?.guidelines?.map((data, index) => (
                    <div key={`key ${index}`}>
                      <h4 className="mb-2 text-xs font-semibold text-gray-700">
                        {data?.title}
                      </h4>

                      <ul className="space-y-1 text-xs text-gray-500 list-disc pl-4">
                        {data?.list?.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                {/* Back */}
                {activeStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="border px-8 rounded py-1 bg-white text-black"
                  >
                    Back
                  </button>
                )}

                {/* Next (Create + Edit only) */}
                {activeStep < totalSteps && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="border px-8 rounded py-1 bg-black text-white"
                  >
                    Next
                  </button>
                )}

                {/* Last Step Button */}
                {!isViewMode && activeStep === totalSteps && (
                  <button
                    type="submit"
                    className="border px-4 rounded py-1 bg-black text-white"
                  >
                    {isEditMode ? "Edit Property" : "Save Property"}
                  </button>
                )}
              </div>

            </aside>

            <div className="col-span-19 ">
              <div className="flex gap-4 border-b px-4">
                {newProperty.map((item) => {
                  const isActive = item.step === activeStep;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setActiveStep(item.step)}
                      className={`px-4 py-2  text-sm font-medium transition
                ${isActive
                          ? "border-b-2 border-black"
                          : "text-[#7B7B7B] hover:bg-[#F4F8FF]"
                        }`}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>

              {/* Step Content */}
              <div className="">
                <div className="">{currentStep?.component}</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
