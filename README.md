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

<!-- In a README.md in your project’s main directory, include a writeup describing your project, and specifically your file MUST include all of the following:
Under its own header within the README called Distinctiveness and Complexity: Why you believe your project satisfies the distinctiveness and complexity requirements, mentioned above.
What’s contained in each file you created.
How to run your application.
Any other additional information the staff should know about your project.
If you’ve added any Python packages that need to be installed in order to run your web application, be sure to add them to a requirements.txt file!
Though there is not a hard requirement here, a README.md in the neighborhood of 500 words is likely a solid target, assuming the other requirements are also satisfied. -->
