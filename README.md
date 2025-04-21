This project is based on t3 stack, if you want to study the t3 stack you take a view its official website, while creation we have selection option that are shown as in image below
Create T3 Stack Project (https://create.t3.gg/)


<h1>Project Management App</h1>
<p>This is a project management application built using the T3 Stack. The T3 Stack includes Next.js, Prisma, tRPC, Tailwind CSS, and other modern technologies to create a full-stack web application.</p>

<p>
This project is built using the T3 Stack. If you're interested in learning more about the T3 Stack, you can visit its official website: Create T3 Stack Project.
During project setup, you'll be presented with various configuration options, as shown in the image below.
</p>


![Screenshot from 2025-04-21 22-54-41](https://github.com/user-attachments/assets/517ee3a7-fdf9-404b-8918-84ebd6a4c6c3)

<h2>Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js (v16 or later)</li>
  <li>PostgreSQL (or any other database supported by Prisma)</li>
</ul>

<h3>Installation</h3>
<ol>
  <li>Clone the repository:
    <pre><code>git clone &lt;repository-url&gt;

cd project-management-app
    </code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Set up the database:
    <pre><code>npx prisma migrate dev</code></pre>
  </li>
  <li>Start the development server:
    <pre><code>npm run dev</code></pre>
  </li>
  <li>Open the app in your browser at <code>http://localhost:3000</code>.</li>
</ol>

<hr />

<h2>Database Design</h2>

<p>The database schema is designed to support the core functionality of the project management app. Below is the database design represented in table format, along with their relationships.</p>

<h3>Tables and Relationships</h3>

<h3>User</h3>
<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>String</td>
      <td>Primary key, unique user ID.</td>
    </tr>
    <tr>
      <td>name</td>
      <td>String?</td>
      <td>User's name.</td>
    </tr>
    <tr>
      <td>email</td>
      <td>String?</td>
      <td>User's email, must be unique.</td>
    </tr>
    <tr>
      <td>emailVerified</td>
      <td>DateTime?</td>
      <td>Email verification timestamp.</td>
    </tr>
    <tr>
      <td>image</td>
      <td>String?</td>
      <td>Profile image URL.</td>
    </tr>
    <tr>
      <td>password</td>
      <td>String</td>
      <td>Hashed password.</td>
    </tr>
  </tbody>
</table>
<p><strong>Relationships:</strong></p>
<ul>
  <li>A user can have multiple <code>Account</code> entries.</li>
  <li>A user can have multiple <code>Session</code> entries.</li>
  <li>A user can own multiple <code>Project</code> entries (<code>ownedProjects</code>).</li>
  <li>A user can be part of multiple projects as a team member (<code>teamProjects</code>).</li>
  <li>A user can be assigned to multiple tasks (<code>assignedTasks</code>).</li>
</ul>

<h3>Account</h3>
<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>String</td>
      <td>Primary key, unique account ID.</td>
    </tr>
    <tr>
      <td>userId</td>
      <td>String</td>
      <td>Foreign key referencing <code>User.id</code>.</td>
    </tr>
    <tr>
      <td>type</td>
      <td>String</td>
      <td>Account type (e.g., OAuth, credentials).</td>
    </tr>
    <tr>
      <td>provider</td>
      <td>String</td>
      <td>Provider name (e.g., Google, GitHub).</td>
    </tr>
    <tr>
      <td>providerAccountId</td>
      <td>String</td>
      <td>Unique ID from the provider.</td>
    </tr>
    <tr>
      <td>refresh_token</td>
      <td>String?</td>
      <td>OAuth refresh token.</td>
    </tr>
    <tr>
      <td>access_token</td>
      <td>String?</td>
      <td>OAuth access token.</td>
    </tr>
    <tr>
      <td>expires_at</td>
      <td>Int?</td>
      <td>Token expiration timestamp.</td>
    </tr>
  </tbody>
</table>
<p><strong>Relationships:</strong></p>
<ul>
  <li>Belongs to a <code>User</code>.</li>
</ul>

<h3>Session</h3>
<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>String</td>
      <td>Primary key, unique session ID.</td>
    </tr>
    <tr>
      <td>sessionToken</td>
      <td>String</td>
      <td>Unique session token.</td>
    </tr>
    <tr>
      <td>userId</td>
      <td>String</td>
      <td>Foreign key referencing <code>User.id</code>.</td>
    </tr>
    <tr>
      <td>expires</td>
      <td>DateTime</td>
      <td>Session expiration timestamp.</td>
    </tr>
  </tbody>
</table>
<p><strong>Relationships:</strong></p>
<ul>
  <li>Belongs to a <code>User</code>.</li>
</ul>

<h3>Project</h3>
<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>String</td>
      <td>Primary key, unique project ID.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>String</td>
      <td>Project title.</td>
    </tr>
    <tr>
      <td>description</td>
      <td>String</td>
      <td>Project description.</td>
    </tr>
    <tr>
      <td>status</td>
      <td>Enum</td>
      <td>Project status (<code>PENDING</code>, <code>ACTIVE</code>, <code>COMPLETED</code>).</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>DateTime</td>
      <td>Timestamp when the project was created.</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>DateTime</td>
      <td>Timestamp when the project was last updated.</td>
    </tr>
    <tr>
      <td>ownedBy</td>
      <td>String</td>
      <td>Foreign key referencing <code>User.id</code>.</td>
    </tr>
  </tbody>
</table>
<p><strong>Relationships:</strong></p>
<ul>
  <li>Owned by a <code>User</code> (<code>owner</code>).</li>
  <li>Can have multiple <code>Task</code> entries.</li>
  <li>Can have multiple team members (<code>ProjectAndTeam</code>).</li>
</ul>

<h3>Task</h3>
<table>
  <thead>
    <tr>
      <th>Column</th>
      <th>Type</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>id</td>
      <td>String</td>
      <td>Primary key, unique task ID.</td>
    </tr>
    <tr>
      <td>title</td>
      <td>String</td>
      <td>Task title.</td>
    </tr>
    <tr>
      <td>description</td>
      <td>String</td>
      <td>Task description.</td>
    </tr>
    <tr>
      <td>projectId</td>
      <td>String</td>
      <td>Foreign key referencing <code>Project.id</code>.</td>
    </tr>
    <tr>
      <td>status</td>
      <td>Enum</td>
      <td>Task status (<code>TODO</code>, <code>INPROCESS</code>, <code>COMPLETED</code>).</td>
    </tr>
    <tr>
      <td>tags</td>
      <td>String[]</td>
      <td>Tags associated with the task.</td>
    </tr>
    <tr>
      <td>priority</td>
      <td>String?</td>
      <td>Task priority (<code>LOW</code>, <code>MEDIUM</code>, <code>HIGH</code>).</td>
    </tr>
    <tr>
      <td>startDate</td>
      <td>DateTime</td>
      <td>Task start date.</td>
    </tr>
    <tr>
      <td>endDate</td>
      <td>DateTime</td>
      <td>Task end date.</td>
    </tr>
    <tr>
      <td>createdAt</td>
      <td>DateTime</td>
      <td>Timestamp when the task was created.</td>
    </tr>
    <tr>
      <td>updatedAt</td>
      <td>DateTime</td>
      <td>Timestamp when the task was last updated.</td>
    </tr>
    <tr>
      <td>createdBy</td>
      <td>String</td>
      <td>Foreign key referencing <code>User.id</code>.</td>
    </tr>
  </tbody>
</table>
<p><strong>Relationships:</strong></p>
<ul>
  <li>Belongs to a <code>Project</code>.</li>
  <li>Can have multiple assignees (<code>TaskAndUser</code>).</li>
</ul>

<h3>Entity Relationship Diagram (ERD)</h3>
<p>Below is a simplified representation of the relationships between the tables:</p>
<pre>
User
  ├── Account (1-to-many)
  ├── Session (1-to-many)
  ├── Project (1-to-many, as owner)
  ├── ProjectAndTeam (many-to-many, as team member)
  └── TaskAndUser (many-to-many, as assignee)

Project
  ├── Task (1-to-many)
  └── ProjectAndTeam (many-to-many, with User)

Task
  └── TaskAndUser (many-to-many, with User)
</pre>

<h2>Features</h2>
<ul>
  <li>User authentication and session management using NextAuth.js.</li>
  <li>Project management with team collaboration.</li>
  <li>Task assignment and tracking with priorities and statuses.</li>
  <li>Database powered by Prisma and PostgreSQL.</li>
</ul>

<h1>Deployment</h1>
<p> Follow the offical blog for docker for its deployment https://sst.dev/docs/start/aws/nextjs/#containers</p>
