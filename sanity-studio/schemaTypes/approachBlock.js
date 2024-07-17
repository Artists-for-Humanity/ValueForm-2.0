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
      description: "Enter a numeric value for ordering or identification purposes",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Enter the main title of the intro block",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      description: "Enter the main body text of the intro block",
    }),
    defineField({
      name: "underlineText",
      title: "Underline Text",
      type: "string",
      description: "This should be a segment from the body text that needs to be underlined",
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
      description: "These should be parts of the body text that need to be bolded",
    }),
    defineField({
      name: "class",
      title: "Class",
      type: "object",
      description: "CSS class properties for styling the intro block",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          description: "Enter the CSS class name",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          description: "Upload an image to represent the class",
        }),
        defineField({
          name: "width",
          title: "Width",
          type: "string",
          description: "Enter the width property for the class",
        }),
        defineField({
          name: "height",
          title: "Height",
          type: "string",
          description: "Enter the height property for the class",
        }),
        defineField({
          name: "top",
          title: "Top",
          type: "string",
          description: "Enter the top position property for the class",
        }),
        defineField({
          name: "left",
          title: "Left",
          type: "string",
          description: "Enter the left position property for the class",
        }),
        defineField({
          name: "background",
          title: "Background",
          type: "string",
          description: "Enter the background property for the class",
        }),
        defineField({
          name: "borderRadius",
          title: "Border Radius",
          type: "string",
          description: "Enter the border radius property for the class",
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
      description: "List the capabilities or features associated with this intro block",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "class.image",
    },
  },
});
