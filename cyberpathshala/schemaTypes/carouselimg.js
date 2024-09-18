import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'carouselimg',
  title: 'carouselimg',
  type: 'document',
  fields: [
    {
      name:"name",
      type:"string",
      title: "Course name",
      validation: (Rule) => Rule.required(),
    },
    {
      name:"image",
      type:"image",
      title:"Image of the Course",
    },     
  ],
})
