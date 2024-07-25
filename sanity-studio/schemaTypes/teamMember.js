import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Number",
      type: "number",
      description: "Enter a numeric value for ordering or identification purposes",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Enter the name of the team member",
    }),
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      description: "Enter the job title of the team member",
    }),
    defineField({
      name: "imgSrc",
      title: "Head Shot",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Upload a high-resolution headshot of the team member in PNG format with a transparent background.",
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      description: "Ensure the bio does not exceed 100 characters.",
    }),
    defineField({
      name: "clients",
      title: "Client List",
      type: "object",
      description: "List the clients associated with the team member.",
      fields: [
        defineField({
          name: "categories",
          title: "Categories",
          type: "array",
          description: "Use a colon (:), at the end of category names.",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Category Name",
                  type: "string",
                  description: "Enter the name of the client category.",
                }),
                defineField({
                  name: "list",
                  title: "Client List",
                  type: "string",
                  description: "Ensure that clients are added in a comma seperated list using title case.",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      description: "Provide the team member's contact information, listing the email as the first contact method.",
      fields: [
        defineField({
          name: "methods",
          title: "Contact Methods",
          type: "array",
          description: "Ensure the mailto links are used for email. (ex. mailto:c.pross@valueform.io) ",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Method Name",
                  type: "string",
                  description: "Enter the name of the contact method",
                }),
                defineField({
                  name: "link",
                  title: "Link",
                  type: "url",
                  description: "Enter the link for the contact method",
                  validation: (Rule) =>
                    Rule.uri({
                      allowRelative: true, // Allow relative URLs
                      scheme: ["http", "https", "mailto"], // Allowed schemes
                    }),
                }),
                defineField({
                  name: "display",
                  title: "Display Text",
                  type: "string",
                  description: "Enter the display text for the contact method",
                }),
              ],
            }),
          ],
          initialValue: [
            {
              name: "Email",
              link: "",
              display: "Email",
            },
          ],
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "imgSrc",
    },
  },
});
