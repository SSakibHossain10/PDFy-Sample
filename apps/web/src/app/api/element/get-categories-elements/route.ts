export const dynamic = "force-static";
export const revalidate = 86400;

import connectDB from "@/lib/connectDB";
import ElementCategory from "@/models/ElementCategory";
import { IElement } from "@/schemas/elementSchema";
import delay from "@/utils/delay";

export type IGetElementCategoryItemsRespose = {
  _id: string;
  name: string;
  category_elements: IElement[];
};

export async function GET() {
  try {
    connectDB(); // Ensure the database connection is established

    const elementCategoryElement = await ElementCategory.aggregate([
      {
        $facet: {
          // Separate pipeline for root category items
          category_items: [
            {
              $match: {
                _id: null,
              },
            },
            {
              $lookup: {
                from: "elements",
                localField: "_id",
                foreignField: "category_id",
                as: "category_elements",
              },
            },
          ],
          // Separate pipeline for nested subcategories items
          category_nested_subcatogories_items: [
            {
              // Match immediate subcategories of root categories
              $match: {
                parent_category: null,
              },
            },
            {
              // Recursive lookup for subcategories
              $graphLookup: {
                from: "elementcategories",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent_category",
                as: "all_subcategories",
              },
            },
            {
              // Combine all subcategories
              $addFields: {
                all_subcategories: {
                  $concatArrays: [
                    "$all_subcategories",
                    [
                      {
                        _id: "$_id",
                        parent_category: "$parent_category",
                        name: "$name",
                        is_collapse: "$is_collapse",
                      },
                    ],
                  ],
                },
              },
            },
            {
              // Flatten subcategories
              $unwind: {
                path: "$all_subcategories",
              },
            },
            {
              // Join with elements collection for subcategories
              $lookup: {
                from: "elements",
                localField: "all_subcategories._id",
                foreignField: "category_id",
                as: "subcategory_elements",
              },
            },
            {
              // Group by element
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
                is_collapse: { $first: "$is_collapse" },
                order: { $first: "$order" },
                sub_categories: { $push: "$all_subcategories" },
                subcategory_elements: { $push: "$subcategory_elements" },
              },
            },
            {
              // Combine all subcategory elements
              $addFields: {
                category_elements: {
                  $reduce: {
                    input: "$subcategory_elements",
                    initialValue: [],
                    in: { $concatArrays: ["$$value", "$$this"] },
                  },
                },
              },
            },
          ],
        },
      },
      {
        // Combine category items and nested subcategories items
        $addFields: {
          all_category_and_nested_categories_items: {
            $concatArrays: ["$category_items", "$category_nested_subcatogories_items"],
          },
        },
      },
      {
        // Flatten combined categories
        $unwind: {
          path: "$all_category_and_nested_categories_items",
        },
      },
      {
        $addFields: {
          // Map fields from combined categories
          _id: "$all_category_and_nested_categories_items._id",
          name: "$all_category_and_nested_categories_items.name",
          is_collapse: "$all_category_and_nested_categories_items.is_collapse",
          order: "$all_category_and_nested_categories_items.order",
          category_elements: "$all_category_and_nested_categories_items.category_elements",
        },
      },
      {
        // Flatten category elements
        $unwind: {
          path: "$category_elements",
        },
      },
      {
        // Group elements by category
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          is_collapse: { $first: "$is_collapse" },
          order: { $first: "$order" },
          category_elements: { $push: "$category_elements" },
        },
      },
      {
        // Sort categories by order
        $sort: {
          order: 1,
        },
      },
      {
        // Sort elements within categories
        $addFields: {
          category_elements: {
            $sortArray: {
              input: "$category_elements",
              sortBy: { order: 1 },
            },
          },
        },
      },
    ]);

    return Response.json(await delay(elementCategoryElement));
  } catch (error) {
    console.log("Error fetvhing categories elements:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
