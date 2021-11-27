# ex3-Eliachar_Feig
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6212085&assignment_repo_type=AssignmentRepo)
# ex2-template
A started template for JS project

<h1>Eliachar Feig</h1>
<p>Email: eliacharfet@edu.hac.ac.il<br>
 ID: 302278338</p>

<h1>Execution</h1>
<p>
The submission is a WebStorm project that can be run directly from the IDE. <br><br>
 The program is executing a connection to NASA API server. The goal is to get mars <br>
 photos according to user inputs which includes a date, a mission and a camera. <br>
 First it uses 3 fetches to get basic data about the 3 missions (landing date, max <br>
 earth date and max sol) and save those in variables. If the fetch is doesnt working <br>
 due to Server break down (404, 504 etc) will insert default data about the missions. <br>
 This program open an html page which has a form where the user to insert a valid date<br>
 or Sol, a mission name and a camera name. Then when the user is submiiting the<br>
 form, do validation and inform the user what is wrong under the particular input field. <br>
 If all the inputs are correct then executes another fetch with the data to get the mars <br>
 photos and show them in 3 columns with details about each photo and with 2 buttons, 1 button<br>
 save the image in a list of saved imges (with it details and an opthion to full screen <br>
 mode of the image in a new tab), and 1 button that shows the <br>
 photo at full screen mode (in another tab). An image can be saved only once, if the user<br>
 tries to save an image that is already saved will get a message throught a pop up modal<br>
 that appears on the screen whithout the need of scrolling up or down. <br>
 There is a button that shows a display bootstrap carousel of the current photos that <br>
 dispalays at the DOM.<br>
 There is a button that open a modal with my personal datails.
</p>
<h1>Assumptions</h1>
<p>
  The site use bootstap CDN therefore assumes an internet connection is available.
</p>
