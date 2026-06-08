// NOTE: This static array is now used only as one-time SEED data for the
// `blog_posts` Supabase table (see scripts/seed-blog.ts). The live site reads
// posts from Supabase via src/lib/blog.functions.ts. Types live in blog.types.ts.
import type { BlogPost, BlogBlock } from "@/lib/blog.types";

export type { BlogPost, BlogBlock };

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-reduce-anxiety",
    title: "How to Reduce Anxiety: 7 CBT Techniques That Actually Work",
    excerpt:
      "Anxiety doesn't need to run your day. Here are seven cognitive-behavioral techniques you can use the next time your chest tightens — backed by decades of research, written in plain English.",
    description:
      "Practical CBT techniques to reduce anxiety in minutes. Plain-English steps you can use right now — no jargon, no fluff.",
    publishedAt: "2026-04-12",
    readingMinutes: 7,
    category: "Anxiety",
    tldr: [
      "The fastest way to lower acute anxiety is to slow your exhale (longer than your inhale) for 60–90 seconds.",
      "Most anxious thoughts are cognitive distortions — once you can name them, they lose power.",
      "Avoiding the thing that scares you trains your brain to fear it more. Tiny, graded exposure rewires the alarm.",
    ],
    body: [
      { type: "p", text: "If you're reading this with your shoulders up by your ears, start here: breathe out for longer than you breathe in. Four seconds in, six to eight out. Do it for one minute. That single shift tells your nervous system the threat has passed." },
      { type: "p", text: "That's technique #1. Here are six more — all drawn from Cognitive Behavioral Therapy, the most evidence-backed approach to anxiety we have." },
      { type: "h2", text: "1. Box breathing (60 seconds, anywhere)" },
      { type: "p", text: "Inhale 4, hold 4, exhale 4, hold 4. Repeat. Used by Navy SEALs before high-stakes operations. It works because slow, paced breathing activates the vagus nerve and downshifts your fight-or-flight system." },
      { type: "h2", text: "2. Name the distortion" },
      { type: "p", text: "When your brain says \"everyone will laugh at me\" or \"I'll definitely fail,\" it's running a cognitive distortion — usually catastrophizing, mind-reading, or all-or-nothing thinking. Naming the pattern out loud (\"That's catastrophizing.\") creates a tiny gap between you and the thought. In that gap, you choose." },
      { type: "h2", text: "3. The 5-4-3-2-1 grounding technique" },
      { type: "p", text: "Look around and name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. It pulls your brain out of the imagined future and back into the actual present, where the threat almost never lives." },
      { type: "h2", text: "4. Worry postponement" },
      { type: "p", text: "Schedule a 15-minute \"worry window\" later in the day. When an anxious thought shows up, write it down and tell it: \"Not now. 6pm.\" Most of the time, by 6pm, you don't care anymore. The brain stops escalating when it knows you'll handle it later." },
      { type: "h2", text: "5. Behavioral activation" },
      { type: "p", text: "Anxiety often pairs with avoidance, and avoidance feeds anxiety. Pick the smallest possible version of the thing you're avoiding and do it today. One email. One walk. One phone call. Action breaks the spiral faster than thinking does." },
      { type: "h2", text: "6. Question the evidence" },
      { type: "p", text: "Ask three things: What's the evidence this is true? What's the evidence it's not? If a friend had this thought, what would I say to them? Write the answers down. CBT is at its best when it's on paper." },
      { type: "h2", text: "7. Graded exposure" },
      { type: "p", text: "Make a ladder of the things that scare you, from least to most. Start on rung 1. Stay until your anxiety drops by half. Move to rung 2 next week. Your brain learns through repetition that you survived — and the alarm quiets." },
      { type: "h2", text: "When to get more help" },
      { type: "p", text: "If anxiety is interfering with sleep, work, or relationships for more than a few weeks, please talk to a licensed therapist. These techniques are powerful, but they're not a replacement for professional care. If you're in crisis in the US, call or text 988." },
    ],
  },
  {
    slug: "how-to-stop-overthinking-at-night",
    title: "How to Stop Overthinking at Night (The Science, and What to Do Tonight)",
    excerpt:
      "It's 2am. Your body is exhausted but your brain is replaying that conversation from six years ago. Here's why your mind does this — and a CBT-based plan you can use tonight.",
    description:
      "Why your brain races at night and the exact 4-step CBT plan that turns it off. Tested, evidence-based, no melatonin required.",
    publishedAt: "2026-04-19",
    readingMinutes: 6,
    category: "Sleep",
    tldr: [
      "Nighttime rumination happens because your prefrontal cortex relaxes its grip while your default-mode network ramps up.",
      "Trying to force sleep makes it worse. Cognitive shuffling and worry-dumping work because they redirect, not suppress.",
      "A 10-minute pre-bed wind-down is the single highest-ROI sleep intervention we know of.",
    ],
    body: [
      { type: "p", text: "Overthinking at night isn't a moral failure. It's neuroscience. As you wind down, your prefrontal cortex — the part of your brain that filters thoughts — relaxes. Your default-mode network, the part responsible for self-referential thinking, takes over. The result: a parade of half-formed worries, replays, and what-ifs." },
      { type: "h2", text: "Why \"just stop thinking\" doesn't work" },
      { type: "p", text: "Thought suppression is a classic ironic process: the harder you try not to think about something, the more it intrudes. If I tell you not to think about a white bear, you know what happens next. So we don't suppress. We redirect." },
      { type: "h2", text: "The 4-step bedtime CBT protocol" },
      { type: "ol", items: [
        "Worry dump (5 min, before brushing teeth). Write down every open loop in your head. Don't solve them. Just empty the inbox onto paper.",
        "Set a worry window for tomorrow. \"I'll deal with the work thing at 10am.\" Tell your brain it has a parking spot.",
        "Cognitive shuffling in bed. Pick a neutral word like \"river.\" For each letter, list 5 unrelated objects (R: rake, radio, ribbon, rocket, raisin). Your brain can't shuffle and ruminate at the same time.",
        "If you're still awake after 20 minutes, get up. Read something boring under dim light. Bed is for sleep. Don't train your brain to associate the mattress with stress.",
      ] },
      { type: "h2", text: "What to stop doing" },
      { type: "ul", items: [
        "Phone in bed. The blue light is the smaller problem. The dopamine is the bigger one.",
        "Alcohol within 3 hours of sleep. It knocks you out, then wakes you up at 3am with cortisol.",
        "Checking the clock when you wake up. Math is the enemy of returning to sleep.",
      ] },
      { type: "p", text: "Do this for 7 nights. Most people see a noticeable shift. If you don't, talk to a clinician — chronic insomnia has good treatments, and you don't have to white-knuckle it." },
    ],
  },
  {
    slug: "why-you-feel-anxious-for-no-reason",
    title: "Why You Feel Anxious for No Reason — and How to Calm Down Fast",
    excerpt:
      "Sometimes anxiety shows up without a story attached. Here's what's actually happening in your body, and three things you can do in the next two minutes.",
    description:
      "Anxiety with no obvious cause has real biological roots. Understand the why, then use these three CBT-backed techniques to calm down fast.",
    publishedAt: "2026-04-26",
    readingMinutes: 5,
    category: "Anxiety",
    tldr: [
      "Anxiety \"for no reason\" usually has a reason — it's just below the threshold of conscious awareness: blood sugar, caffeine, poor sleep, hormones, or unprocessed stress.",
      "Your body can produce anxiety symptoms first; the brain then writes a story to explain them.",
      "Naming the physical state (\"I'm activated\") instead of the story (\"something is wrong\") shortens the episode dramatically.",
    ],
    body: [
      { type: "p", text: "You're sitting on the couch. Nothing has happened. And suddenly your chest is tight and your mind is searching for a reason. Sound familiar?" },
      { type: "h2", text: "What's actually going on" },
      { type: "p", text: "Anxiety is your body's threat-detection system firing — sometimes from real triggers (low blood sugar, too much caffeine, poor sleep, a stress hormone surge), sometimes from accumulated stress your conscious mind hasn't processed yet. The brain then does what brains do: it invents a reason. \"Maybe it's my job. Maybe it's my relationship. Maybe I'm sick.\" Most of those stories are wrong." },
      { type: "h2", text: "What to do in the next 2 minutes" },
      { type: "ol", items: [
        "Label, don't explain. Say (out loud or in your head): \"My body is activated right now. That's all this is.\" You're not denying it; you're refusing to feed it a story.",
        "Cold water on your face or wrists for 30 seconds. Triggers the mammalian dive reflex, which slows your heart rate.",
        "Box breathing for 60 seconds (in 4, hold 4, out 4, hold 4). Most episodes peak and pass inside 10 minutes if you stop pouring narrative fuel on them.",
      ] },
      { type: "h2", text: "The longer game" },
      { type: "p", text: "If this happens often, look at the basics first: caffeine after noon, sleep under 7 hours, skipped meals, alcohol the night before. Then look at chronic stress you're carrying without acknowledging. A CBT coach (human or AI) can help you find the patterns you can't see from the inside." },
    ],
  },
  {
    slug: "how-to-deal-with-a-depressive-episode",
    title: "How to Deal With a Depressive Episode: A Gentle, Step-by-Step Guide",
    excerpt:
      "You don't have to feel better to do better. Here's a small, kind plan for the days when getting out of bed feels like a victory.",
    description:
      "A compassionate, evidence-based plan for getting through a depressive episode — the smallest possible steps, in the right order.",
    publishedAt: "2026-05-03",
    readingMinutes: 6,
    category: "Depression",
    tldr: [
      "Depression lies. The voice telling you nothing will help is the illness, not the truth.",
      "Behavioral activation — doing small things before you feel like it — is the most evidence-backed self-help technique for depression.",
      "Connection, even tiny amounts, measurably shortens depressive episodes.",
    ],
    body: [
      { type: "p", text: "If you're reading this in the middle of a hard week: I'm sorry. You're not lazy. You're not broken. Your brain chemistry is making the next ten minutes feel like climbing a mountain, and you're still here, still trying. That counts." },
      { type: "h2", text: "Start smaller than feels reasonable" },
      { type: "p", text: "Depression flattens your motivation system. You're waiting to feel like doing things. That feeling isn't coming first. Action has to come first; feeling follows. So we make the action absurdly small." },
      { type: "h2", text: "The minimum viable day" },
      { type: "ol", items: [
        "Open the window. Let outside air in for 60 seconds.",
        "Drink one glass of water.",
        "Move for 5 minutes — a walk down the hallway counts.",
        "Eat something with protein, even if it's not the right meal time.",
        "Send one message to one person who likes you. \"Hey\" is enough.",
      ] },
      { type: "p", text: "That's it. That's the whole day if it needs to be. Tomorrow you might add one more thing. You might not. Both are fine." },
      { type: "h2", text: "What to gently watch out for" },
      { type: "ul", items: [
        "Scrolling for hours. It numbs but doesn't restore.",
        "Isolating completely. Even one text to one person makes a measurable difference.",
        "Believing the thoughts. Depression is a very convincing liar.",
      ] },
      { type: "h2", text: "When to get more help" },
      { type: "p", text: "If you're having thoughts of harming yourself, please reach out now — in the US, call or text 988. If your low mood has lasted more than two weeks, please talk to a doctor or therapist. You wouldn't try to set your own broken leg. You don't have to do this alone either." },
    ],
  },
  {
    slug: "10-cognitive-distortions",
    title: "10 Cognitive Distortions That Are Wrecking Your Mood",
    excerpt:
      "Your brain runs a handful of predictable thought-glitches. Learn to spot them and you take back the steering wheel.",
    description:
      "A clear list of the 10 most common cognitive distortions — with examples and what to do when you catch yourself doing one.",
    publishedAt: "2026-05-10",
    readingMinutes: 8,
    category: "CBT",
    tldr: [
      "Most low moods are driven by a small number of repeatable thinking errors, not by reality.",
      "You don't have to argue with the thought. Naming the distortion is usually enough to take its power away.",
      "These patterns show up in everyone. Spotting them is a learnable skill.",
    ],
    body: [
      { type: "p", text: "Aaron Beck, the founder of CBT, noticed something in the 1960s: his patients weren't reacting to reality. They were reacting to a distorted version of reality their own minds had served them. He cataloged the most common distortions. Six decades later, the list still holds up." },
      { type: "h2", text: "1. All-or-nothing thinking" },
      { type: "p", text: "\"If I don't do this perfectly, it's worthless.\" Reality lives in the middle. Almost nothing is 100% one thing." },
      { type: "h2", text: "2. Catastrophizing" },
      { type: "p", text: "\"If I make a mistake on this email, I'll get fired, lose my apartment, and die alone.\" Ask: what's the actual worst likely outcome, not the worst conceivable one?" },
      { type: "h2", text: "3. Mind reading" },
      { type: "p", text: "Assuming you know what someone else is thinking — usually that they're judging you. You don't. They're mostly thinking about themselves." },
      { type: "h2", text: "4. Fortune telling" },
      { type: "p", text: "Predicting a bad outcome as if it's certain. \"This date will go terribly.\" Maybe. Maybe not. The future hasn't been written." },
      { type: "h2", text: "5. Emotional reasoning" },
      { type: "p", text: "\"I feel like a failure, therefore I am one.\" Feelings are data, not verdicts. They tell you what you're experiencing, not what's true." },
      { type: "h2", text: "6. Should statements" },
      { type: "p", text: "\"I should be further along by now.\" According to whom? Should statements are usually internalized rules from someone else's life." },
      { type: "h2", text: "7. Labeling" },
      { type: "p", text: "Turning a behavior into an identity. \"I made a mistake\" becomes \"I'm an idiot.\" Watch the verbs. You did a thing. You are not the thing." },
      { type: "h2", text: "8. Personalization" },
      { type: "p", text: "Making someone else's mood, behavior, or outcome about you. \"She seemed off, I must have done something.\" Maybe she just slept badly." },
      { type: "h2", text: "9. Mental filtering" },
      { type: "p", text: "Focusing on the one criticism in a sea of compliments. Your brain does this automatically. You have to manually rebalance the picture." },
      { type: "h2", text: "10. Discounting the positive" },
      { type: "p", text: "\"Yeah, but anyone could have done that.\" Refusing to count wins because they don't fit the self-image. Count them anyway." },
      { type: "h2", text: "What to do when you catch one" },
      { type: "p", text: "Three steps. (1) Name it: \"That's catastrophizing.\" (2) Write down the evidence for and against. (3) Write a more balanced thought you could actually believe. Do this on paper. The act of writing slows the spiral." },
    ],
  },
  {
    slug: "free-mental-health-self-check",
    title: "Free Mental Health Self-Check (2 Minutes, No Login)",
    excerpt:
      "A short, gentle self-check to help you see where your mind is right now — and what kind of support might actually help.",
    description:
      "Take a free, 2-minute mental health self-check. No signup to start. Get a personal wellbeing snapshot and clear next steps.",
    publishedAt: "2026-05-17",
    readingMinutes: 3,
    category: "Self-check",
    tldr: [
      "A short self-check is not a diagnosis. It's a mirror.",
      "Knowing what kind of struggle you're having is the first step to choosing the right kind of help.",
      "Our 2-minute check is free and gives you a clear snapshot plus three personalized suggestions.",
    ],
    body: [
      { type: "p", text: "Most people wait an average of 11 years between noticing a mental health struggle and getting help. Often because they're not sure how bad it is, or whether it \"counts.\" A self-check won't diagnose you, but it will give you language for what you're experiencing — and that's usually the first thing that changes." },
      { type: "h2", text: "What our check measures" },
      { type: "p", text: "Eight short questions, inspired by validated short scales used by clinicians (PHQ-2 and GAD-2). It looks at mood, anxiety, sleep, focus, and how much these are getting in the way of your life. Your answers stay on your device until you choose to save them." },
      { type: "h2", text: "What you'll get" },
      { type: "ul", items: [
        "A wellbeing snapshot in plain English",
        "Three specific suggestions tailored to your pattern",
        "Clear guidance on whether self-help is enough — or whether it's worth talking to someone",
      ] },
      { type: "h2", text: "What it isn't" },
      { type: "p", text: "It's not a diagnosis. It's not a replacement for a clinician. It's a mirror — a kind, structured one — that helps you see where you are so you can make a better next move." },
      { type: "quote", text: "You can't change what you can't see. Most people are surprised by how much clarity comes from just naming it." },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
