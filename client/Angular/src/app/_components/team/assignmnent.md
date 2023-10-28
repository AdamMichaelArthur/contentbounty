Assignment

Create the "team" page.

What Is The "Team" Page?
------------------------

Our users will sometimes want to have Bounties completed by their in-house team members.
For example, if inBrain was using Content Bounty, we would have a freelancer do the content
writing, but Hasan would do graphic design.

The 'Team' page will allow our users to create sub-accounts for their employees to use
Content Bounty.


I have already created the view/route stub
------------------------------------------
Look at _components/team to see the files.

Goto api/app_entry_points/app_entry.js, lines 328-365
Uncommend them out, save, and restart node.js.  (This will happen automatically if using nodemon)
This will delete the existing users in your database, and recreate new ones.

You will need to 'reload' some data from postman to get functionality back up.  I will work
on instructions for this, or send me a message on slack for help.

Step 1
------

(This is already done)

Create a FlexTable with the following characteristics:

Datasource: user
Columns: email,first_name,last_name,role

Step 2
------

Create a Table Header that says "Add User"

This will create a popup that has a form with the following fields:
	text - E-Mail
	text - First Name
	text - Last Name
	text - Password
	text - Confirm Password
	checkbox - require user to change password
	button - Create User

When the user clicks create user, the API function

POST {{local}}/user
{
	"email":"user15@gmail.com",
	"first_name":"First Name 1",
	"last_name":"Last Name 1",
	"pwd":"dino",
	"role":"user"
}

Will be called to create the user.  The user will get an email notifying them of the newly created account.

