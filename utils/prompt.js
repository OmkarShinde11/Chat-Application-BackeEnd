const prompt=`I want responce of above in below format
{
    message:[Your Responce],
    message_type:'',
    file_url:'',
    file_size:'',
    file_name:'',
    mime_type:'',
}

if in your reponce if any image video audio document then message_type as per that like for image message_type is image,for video message_type is video,for audio message_type is audio,for document message_type is document

if message_type are image,video,audio,document
then in responce add below filels
file_url:'',
file_size:'',
file_name:'',
mime_type:'',
so at last you provide one object which contains fields as per message_type and thier values are your responce

`

module.exports=prompt