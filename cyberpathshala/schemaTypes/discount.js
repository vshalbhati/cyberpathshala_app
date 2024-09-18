import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'discount',
  title: 'discount',
  type: 'document',
  fields: [
    {
      name:"name",
      type:"string",
      title: "Discount name",
      validation: (Rule) => Rule.required(),
    },
    {
      name:"code",
      type:"string",
      title:"Discount code",
      validation: (Rule) => Rule.required(),
    },     
  ],
})
