import { defineField, defineType } from "sanity";

export default defineType({
  name: "complexIntroBlock",
  title: "Complex Intro Block",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Number",
      type: "number",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
    }),
    defineField({
      name: "underlineText",
      title: "Underline Text",
      type: "string",
      description: "This should be a segment from the body text",
    }),
    defineField({
      name: "boldText",
      title: "Bold Text",
      type: "array",
      of: [
        defineField({
          type: "string",
        }),
      ],
      description: "These should be parts of the body text",
    }),
    defineField({
      name: "class",
      title: "Class",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
        }),
        defineField({
          name: "width",
          title: "Width",
          type: "string",
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "string",
        }),
        defineField({
          name: "top",
          title: "Top",
          type: "string",
        }),
        defineField({
          name: "left",
          title: "Left",
          type: "string",
        }),
        defineField({
          name: "background",
          title: "Background",
          type: "string",
        }),
        defineField({
          name: "borderRadius",
          title: "Border Radius",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [
        defineField({
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "class.image",
    },
  },
});
