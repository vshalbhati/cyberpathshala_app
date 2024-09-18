import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'categories',
  title: 'categories',
  type: 'document',
  fields: [
    {
      name:"name",
      type:"string",
      title: "Course name",
      validation: (Rule) => Rule.required(),
    },
    { 
        name: 'subjects',
        title: 'Subjects',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'subject' }] }],
    } 
      
  ],
})
