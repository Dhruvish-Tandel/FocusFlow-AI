const express = require('express');
const OpenAI = require('openai');

const Subject = require('../models/Subject');
const { protect } = require('../middleware/auth');

const router = express.Router();


// OpenRouter client
const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


// POST /api/schedule/generate
router.post('/generate', protect, async (req, res) => {

  try {

    const subjects = await Subject.find({
      user: req.user._id
    });


    if (!subjects.length) {
      return res.status(400).json({
        message: "Please add at least one subject first."
      });
    }


    const today = new Date().toDateString();

    const studyHours = req.user.studyHoursPerDay || 4;

    const startTime = req.user.preferredStartTime || "09:00";


    const subjectSummary = subjects.map(s => {

      const daysLeft = s.examDate
        ? Math.ceil(
            (new Date(s.examDate) - new Date()) /
            (1000 * 60 * 60 * 24)
          )
        : null;


      return `
- ${s.name}
difficulty=${s.difficulty}
completion=${s.completionPercent}%
${daysLeft ? `exam in ${daysLeft} days` : "no exam date"}
`;

    }).join("\n");



    const prompt = `

You are FocusFlow AI, an intelligent study planner.

Today is ${today}

Student has ${studyHours} hours available.
Starting time: ${startTime}


Subjects:

${subjectSummary}


Create today's study schedule.


Return ONLY JSON:

{
"greeting":"",
"sessions":[
{
"subject":"",
"startTime":"",
"endTime":"",
"duration":50,
"priority":"high",
"focus":"",
"reason":""
}
],
"tip":""
}


Rules:

- Sessions 25-60 minutes
- Add breaks
- Prioritize upcoming exams
- Prioritize incomplete subjects
- Hard subjects first
- Fit inside available hours

`;



    const response = await client.chat.completions.create({

      model: "meta-llama/llama-3.1-8b-instruct",

      messages:[
        {
          role:"user",
          content:prompt
        }
      ],

      temperature:0.7

    });



    const raw = response.choices[0].message.content;


    const cleaned = raw
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim();



    const schedule = JSON.parse(cleaned);



    res.json({
      date:today,
      schedule
    });



  } catch(err){

    console.error(
      "Schedule generation error:",
      err
    );


    res.status(500).json({
      message:"Failed to generate schedule"
    });

  }

});





// POST /api/schedule/recover

router.post('/recover', protect, async(req,res)=>{


try{


const {missedSessions}=req.body;


const subjects = await Subject.find({
user:req.user._id
});



const prompt = `

You are FocusFlow AI.


Student missed these sessions:

${missedSessions.map(
s=>`- ${s.subject} (${s.date})`
).join("\n")}



Remaining subjects:

${subjects.map(s=>s.name).join(",")}



Create a 3 day recovery plan.


Return ONLY JSON:

{

"message":"",

"recoveryPlan":[
{
"day":"",
"sessions":[
{
"subject":"",
"duration":50,
"focus":""
}
]
}
],

"advice":""

}

`;




const response = await client.chat.completions.create({

model:"meta-llama/llama-3.1-8b-instruct",

messages:[
{
role:"user",
content:prompt
}
]

});



const cleaned=response
.choices[0]
.message
.content
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();



const recovery=JSON.parse(cleaned);



res.json(recovery);



}catch(err){

console.log(err);


res.status(500).json({

message:"Recovery plan failed"

});

}


});



module.exports = router;