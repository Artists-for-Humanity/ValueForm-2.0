// schemas/introBlock.js
import { defineField, defineType } from "sanity";

export default defineType({
  name: "introBlock",
  title: "Intro Block",
  type: "document",
  fields: [
    defineField({
      name: "approach",
      title: "Approach",
      type: "object",
      fields: [
        defineField({
          name: "paragraph",
          title: "Paragraph",
          type: "text",
        }),
        defineField({
          name: "lottieSrc",
          title: "Lottie Source URL",
          type: "url",
        }),
        defineField({
          name: "lottieSpeed",
          title: "Lottie Speed",
          type: "number",
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "approach.paragraph",
    },
  },
});
