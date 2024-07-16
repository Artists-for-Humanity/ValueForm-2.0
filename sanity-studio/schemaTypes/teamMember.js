// schemas/teamMember.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
    }),
    defineField({
      name: "imgSrc",
      title: "Head Shot",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
    }),
    defineField({
      name: "clients",
      title: "Client List",
      type: "object",
      fields: [
        defineField({
          name: "categories",
          title: "Categories",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Category Name",
                  type: "string",
                }),
                defineField({
                  name: "list",
                  title: "Client List",
                  type: "string",
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
      fields: [
        defineField({
          name: "methods",
          title: "Contact Methods",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                defineField({
                  name: "name",
                  title: "Method Name",
                  type: "string",
                }),
                defineField({
                  name: "link",
                  title: "Link",
                  type: "url",
                  validation: Rule => Rule.uri({
                    allowRelative: true, // Allow relative URLs
                    scheme: ['http', 'https', 'mailto'] // Allowed schemes
                  })
                }),
                defineField({
                  name: "display",
                  title: "Display Text",
                  type: "string",
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
