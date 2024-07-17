import { defineField, defineType } from "sanity";

export default defineType({
  name: "approachIntroBlock",
  title: "Approach Intro Block",
  type: "document",
  fields: [
    defineField({
      name: "paragraph",
      title: "Intro Paragraph",
      type: "text",
      description: "Enter the introductory paragraph text for the approach section",
    }),
    defineField({
      name: "lottieSrc",
      title: "Intro Graphic",
      type: "url",
      description: "Enter the URL for the Lottie animation source",
    }),
    defineField({
      name: "lottieSpeed",
      title: "Lottie Speed",
      type: "number",
      description: "Enter the speed at which the Lottie animation should play",
    }),
  ],
  preview: {
    select: {
      title: "paragraph",
      media: "lottieSrc",
    },
  },
});
