import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'subject',
  title: 'Subject',
  type: 'document',
  fields: [
    {
      name:"name",
      type:"string",
      title: "Course name",
      validation: (Rule) => Rule.required(),
    },
    {
      name:"short_description",
      type:"string",
      title: "Short description",
      validation: (Rule) => Rule.min(200),
    },
    {
      name:"Duration",
      type:"string",
      title: "Duration",
      validation: (Rule) => Rule.required(),
    },
    {
      name:"image",
      type:"image",
      title:"Image of the Course",
    },
    {
      name:"rating",
      type:"number",
      title: "Enter a Rating from (1-5 Stars)",
      validation: (Rule) => Rule.required().min(1).max(5).error("Please enter a Value between 1 and 5"),
    },
    { 
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string'}],
    },
    { 
        name: 'videos',
        title: 'Videos',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'video' }] }],
        description: 'Add related videos for the course',
    }      
  ],
})
