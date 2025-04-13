# moloco-mock-frontend
Moloco Ad Campaign Manager Frontend app, an interface for my moc-up Moloco Api:

Features:
Create Campaign
Input a campaign name and create a new campaign instantly.

Campaign List View
Displays all campaigns with expandable detail sections.

Attach Creative Group
Assign creative groups to specific campaigns with dynamic UI controls.

Run Campaign
Simulates a campaign by assigning randomized impressions, clicks, and conversions to each creative group.

Analyze Campaign Results
Shows performance metrics of each creative group, sorted by conversions.

Champion Modal
Displays top-performing creative groups in a modern, responsive modal.

Responsive UI
Built with Tailwind CSS for clean, modern styling and responsiveness.

Dynamic Modals & State Management
Uses React useState and prop drilling for modal visibility and data flow.



Open in terminal or favorite IDE.  Make sure Backed is running first.  See Backend readme for instructions.
Steps to Run, enter in terminal:
1) run 'npm install'
2) run 'npm run dev'

3) Then open up your browser at : ➜  Local:   http://localhost:5173/

# A note on the features:
Right now , since this is just a mock-up, all this user data is stored in memory. In a full version of this app,  I would build a DB to persist user data and create user, and user login pages.  In this current mock-up I am assuming that you are already logged in to an ad account, but in a full app there would also be work place accounts so that people ad accounts could belong to larger organizations.  

# A note about the functionality.
 I felt that  the most important parts of this assignment were to display my ability to complete the basic tasks outlined in the specs, i.e., build a complete campaign and run it,  as well as demonstrate my ability to learn and apply new concepts like in Moloco API docs.  For this reason there is not full CRUD functionality around the Campaigns, and their groups.  Right now it’s all just create. In a full app, there would of course be full CRUD functionality.  I would also add a more complete feature to interface the champions list. Right now it’s just a read only list and not restricted by groups or campaigns. In the full app , I would add a feature to seamlessly drag and drop champions into new groups.  Lastly,  a full app would allow other  types of creatives to be uploaded.  
