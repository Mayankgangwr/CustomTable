import { ISort, ITableHeader, ITableRow } from './Table/Interface'
import moment from 'moment';
import Table from './Table/Table';
interface ITableData {
    name: string;
    description: string;
    createdOn: number;
    expiresOn: number;
    lifecycle: number;
    members: number;
    type: string;
}

const tableHeader: ITableHeader[] = [
    {
        key: "name",
        title: "Name",
    },
    {
        key: "description",
        title: "Description",
        isSearch: true
    },
    {
        key: "createdOn",
        title: "Created on",
        dataType: "date"
    },
    {
        key: "expiresOn",
        title: "Expires on",
    },
    {
        key: "lifecycle",
        title: "Lifecycle",
        dataType: "number",
        isSearch: true
    },
    {
        key: "members",
        title: "Members",
    },
    {
        key: "type",
        title: "Type",
        options: [
            { value: "Designer", text: 'Designer' },
            { value: "Analyst", text: 'Analyst' },
            { value: "Manager", text: 'Manager' }
        ],
    }
];

const tableData: ITableData[] = [
    { name: "Alice Johnson", description: "Project Manager", createdOn: 1625164800, expiresOn: 1633046400, lifecycle: 90, members: 5, type: "Manager" },
    { name: "Bob Smith", description: "Software Engineer", createdOn: 1625251200, expiresOn: 1633046400, lifecycle: 120, members: 3, type: "Analyst" },
    { name: "Charlie Davis", description: "Data Scientist", createdOn: 1625337600, expiresOn: 1633046400, lifecycle: 60, members: 4, type: "Scientist" },
    { name: "Diana Clark", description: "UX Designer", createdOn: 1625424000, expiresOn: 1633046400, lifecycle: 90, members: 2, type: "Designer" },
    { name: "Evan Martinez", description: "Product Owner", createdOn: 1625510400, expiresOn: 1633046400, lifecycle: 180, members: 7, type: "Owner" },
    { name: "Fiona Brown", description: "Business Analyst", createdOn: 1625596800, expiresOn: 1633046400, lifecycle: 120, members: 6, type: "Analyst" },
    { name: "George Wilson", description: "Quality Assurance", createdOn: 1625683200, expiresOn: 1633046400, lifecycle: 90, members: 4, type: "QA" },
    { name: "Hannah Moore", description: "HR Specialist", createdOn: 1625769600, expiresOn: 1633046400, lifecycle: 60, members: 3, type: "HR" },
    { name: "Ian Taylor", description: "DevOps Engineer", createdOn: 1625856000, expiresOn: 1633046400, lifecycle: 120, members: 5, type: "Engineer" },
    { name: "Jane Anderson", description: "Marketing Manager", createdOn: 1625942400, expiresOn: 1633046400, lifecycle: 90, members: 4, type: "Manager" },
    { name: "Kevin Lee", description: "Systems Analyst", createdOn: 1626028800, expiresOn: 1633046400, lifecycle: 180, members: 6, type: "Analyst" },
    { name: "Laura Harris", description: "Sales Executive", createdOn: 1626115200, expiresOn: 1633046400, lifecycle: 60, members: 5, type: "Analyst" },
    { name: "Mike Robinson", description: "Operations Manager", createdOn: 1626201600, expiresOn: 1633046400, lifecycle: 120, members: 7, type: "Manager" },
    { name: "Nina Walker", description: "Finance Officer", createdOn: 1626288000, expiresOn: 1633046400, lifecycle: 180, members: 4, type: "Officer" },
    { name: "Oliver White", description: "Technical Lead", createdOn: 1626374400, expiresOn: 1633046400, lifecycle: 90, members: 6, type: "Lead" },
    { name: "Paula King", description: "Legal Advisor", createdOn: 1626460800, expiresOn: 1633046400, lifecycle: 120, members: 2, type: "Advisor" },
    { name: "Quincy Scott", description: "Customer Support", createdOn: 1626547200, expiresOn: 1633046400, lifecycle: 60, members: 5, type: "Support" },
    { name: "Rachel Young", description: "Content Writer", createdOn: 1626633600, expiresOn: 1633046400, lifecycle: 90, members: 3, type: "Writer" },
    { name: "Sam Green", description: "Network Engineer", createdOn: 1626720000, expiresOn: 1633046400, lifecycle: 120, members: 4, type: "Engineer" },
    { name: "Tina Hall", description: "Project Coordinator", createdOn: 1626806400, expiresOn: 1633046400, lifecycle: 180, members: 6, type: "Designer" },
    { name: "Uma Collins", description: "Security Specialist", createdOn: 1626892800, expiresOn: 1633046400, lifecycle: 60, members: 3, type: "Specialist" },
    { name: "Victor Carter", description: "Research Analyst", createdOn: 1626979200, expiresOn: 1633046400, lifecycle: 120, members: 4, type: "Analyst" },
    { name: "Wendy Mitchell", description: "PR Manager", createdOn: 1627065600, expiresOn: 1633046400, lifecycle: 90, members: 5, type: "Manager" },
    { name: "Xander Perez", description: "Mobile Developer", createdOn: 1627152000, expiresOn: 1633046400, lifecycle: 180, members: 3, type: "Designer" },
    { name: "Yvonne Turner", description: "SEO Specialist", createdOn: 1627238400, expiresOn: 1633046400, lifecycle: 120, members: 4, type: "Specialist" },
    { name: "Zachary Adams", description: "Database Admin", createdOn: 1627324800, expiresOn: 1633046400, lifecycle: 60, members: 2, type: "Admin" },
    { name: "Amy Evans", description: "Software Tester", createdOn: 1627411200, expiresOn: 1633046400, lifecycle: 90, members: 5, type: "Tester" },
    { name: "Brian Murphy", description: "Cloud Architect", createdOn: 1627497600, expiresOn: 1633046400, lifecycle: 120, members: 3, type: "Architect" },
    { name: "Cathy Reed", description: "Graphic Designer", createdOn: 1627584000, expiresOn: 1633046400, lifecycle: 180, members: 2, type: "Designer" },
    { name: "David Rogers", description: "IT Support", createdOn: 1627670400, expiresOn: 1633046400, lifecycle: 60, members: 4, type: "Support" },
    { name: "Ella Ward", description: "Data Analyst", createdOn: 1627756800, expiresOn: 1633046400, lifecycle: 90, members: 5, type: "Analyst" },
    { name: "Frank Hughes", description: "Business Consultant", createdOn: 1627843200, expiresOn: 1633046400, lifecycle: 120, members: 6, type: "Consultant" },
    { name: "Grace Patterson", description: "Event Planner", createdOn: 1627929600, expiresOn: 1633046400, lifecycle: 180, members: 2, type: "Planner" },
    { name: "Henry Bell", description: "Compliance Officer", createdOn: 1628016000, expiresOn: 1633046400, lifecycle: 60, members: 4, type: "Officer" },
    { name: "Isabel Foster", description: "Account Manager", createdOn: 1628102400, expiresOn: 1633046400, lifecycle: 90, members: 5, type: "Manager" },
    { name: "Jack Griffin", description: "Technical Writer", createdOn: 1628188800, expiresOn: 1633046400, lifecycle: 120, members: 3, type: "Writer" },
    { name: "Kelly Hughes", description: "Marketing Analyst", createdOn: 1628275200, expiresOn: 1633046400, lifecycle: 180, members: 4, type: "Analyst" },
    { name: "Leo Sullivan", description: "Communications Specialist", createdOn: 1628361600, expiresOn: 1633046400, lifecycle: 60, members: 5, type: "Specialist" },
    { name: "Megan Butler", description: "Office Manager", createdOn: 1628448000, expiresOn: 1633046400, lifecycle: 90, members: 6, type: "Manager" },
    { name: "Nathan Rogers", description: "Supply Chain Analyst", createdOn: 1628534400, expiresOn: 1633046400, lifecycle: 120, members: 4, type: "Analyst" },
];
function App() {
    const getFormattedTableRow = (data: ITableData): ITableRow => {
        return {
            name: {
                key: data.name,
                value: data.name
            },
            description: {
                key: data.description,
                value: data.description
            },
            createdOn: {
                key: data.createdOn,
                value: moment.unix(data.createdOn).format('MMM DD, YYYY')
            },
            expiresOn: {
                key: data.expiresOn,
                value: moment.unix(data.expiresOn).format('MMM DD, YYYY')
            },
            lifecycle: {
                key: data.lifecycle,
                value: data.lifecycle
            },
            members: {
                key: data.members,
                value: data.members
            },
            type: {
                key: data.type,
                value: data.type
            }
        };
    };
    const handleTableRowsFormat = (tableData: ITableData[]): ITableRow[] => {
        return tableData.map(getFormattedTableRow);
    };

    return (
        <Table
            tableHeader={tableHeader}
            tableRows={handleTableRowsFormat(tableData)}
            initialSort={{ key: "description", sortBy: ISort.ASC }}
        />
    )
}

export default App
