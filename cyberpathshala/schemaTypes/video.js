export default {
    name: 'video',
    title: 'Video',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Video Title',
        type: 'string',
        description: 'Title of the video',
        validation: Rule => Rule.required().min(5).warning('Shorter titles may not be descriptive enough.'),
      },
      {
        name: 'description',
        title: 'Video Description',
        type: 'text',
        description: 'A brief description of the video content',
      },
      {
        name: 'videoFile',
        title: 'Video File',
        type: 'file',
        options: {
          accept: 'video/*',  // Only accept video files
        },
        description: 'Upload the video file from your device',
      },
    ],
  };
  