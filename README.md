# Therapy

Website to help people deal with negative emotions

## About

My plan with this website is for it to be useful to those that struggle with negative emotions (most of us). I wanted to give people a resource where they can quickly reference scriptures that can help them with their specific needs.

The primary section of this web application is the "Challenges" section. I created a list of a number of different challenging feelings that we as human beings face on a daily basis. Each topic features practical advice from the Bible to help users gain a greater degree of control over their thoughts, and subsequently, their feelings. Along with each piece of advice is a scriptural reference, so that users can see that the advice does not have me as its source, but rather it is based on wisdom from our Creator. Also, each piece of advice includes the citation for the scripture, as well as an option to add the advice to a users personal goals.

It features a section where upon logging in users can also create their own goals to help them work on their emotional health issues. People can either select a goal to add from a list of helpful advice in the "challenges" section, or they can create their goal from scratch.

There is also a scripture look up page, where users can choose from a variety of different Bible translations. The Bible feature makes use of an API to fetch all the data, and is probably what took me the longest to get working. One of the reasons is that different Bible translations can have different books of the Bible in them. (For instance, some of the translations just include the Old Testament, some just the New Testament, and some add in the Apocrypha.) So after selecting a Bible translation, I couldn't just hard code in the books of the Bible, but rather each time the translation is changed, the application needs to make a call to the API so that the correct Bible books can be displayed.

The register/login/logout functionality is quite basic. However, I did include functionality so that after logging in, the user was redirected back to the previous page that they were on. Some features, such as creating a goal requires that users be logged in

This project is still very much a work in progress. While I have achieved basic functionality with it, I will be working on it through the months ahead to refine it. What I want to do in the future is see if I can optimize the API calls so that not as many need to be made. Also, I want to improve the navigation on the Bible page so that users can easily transition to the next chapter without having to use the dropdown menu.

## Distinctiveness and Complexity

Why do I believe that this project satisfies the distinctiveness and complexity requirements?

This project is not an e-commerce site, nor a social network. (Although I hope in the future to add functionality where I can alow users to share their goals with others.) Nor is this site based on any of the previous projects.

Additionally, this application uses Django, and has 1 model besides User, being Goals. As for further complexity, for the Bible page Javascript is used on the front end to call the API on the back end, which calls the external API for bible translation data. I did this so that the API key isn't visible on the front end. Javascript is also used to change classes as needed to work along with Bootstrap.

## Files added

-   README.md - this file
-   requirements.txt - requirements
-   .gitignore - which ignores my .env where my secret key and api key are stored
-   therapy/ - folder made upon django start project, contains settings files etc
-   biblehelp/ - main project folder
    -   context_processors.py - to share challenge names across templates to avoid hard coding them- in case I want to add more later
    -   data.py - contains hard coded advice on how to deal with challenges, as well as scriptures and citations
    -   forms.py - contains the goal form to create a new goal
    -   static/
        -   bible.js - scripts specifically for Bible page
        -   scripts.js - general scripts
        -   styles.css - general styles
    -   templates/
        -   bible.html - Bible page, used to look up scriptures
        -   create.html - page for creating new goals
        -   emotion.html - dynamically generated page for each challenge in thinking
        -   goals.html - contains goals that have been created by user
        -   index.html - home page that welcomes users by providing practical thinking advice
        -   layout.html - general layout which includes the top navbar
        -   login.html - used to login and logout
        -   register.html - used to register for an account

# How to Run

Visit <https://thinkingbiblically.pythonanywhere.com/>

Choose "Challenges" to start viewing helpful advice for challenging emotions, "Bible" to read the Bible in multiple translations, "Log in/ Register" to login or register, then after logging in, visit "Goals" to create or view your goals.
