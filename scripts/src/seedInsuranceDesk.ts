import { db, usersTable, membersTable, requestsTable, settingsTable } from "@workspace/db";
import bcrypt from "bcryptjs";

async function main() {
  const [existingAdmin] = await db.select().from(usersTable).limit(1);
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(usersTable).values({
      username: "admin",
      passwordHash,
      role: "admin",
    });
    console.log("Seeded admin account: username=admin password=admin123");
  } else {
    console.log("Users already exist, skipping admin seed");
  }

  const [existingSettings] = await db.select().from(settingsTable).limit(1);
  if (!existingSettings) {
    await db.insert(settingsTable).values({ facilityName: "AfricMed Hospital" });
    console.log("Seeded facility settings");
  } else {
    console.log("Settings already exist, skipping");
  }

  const [existingMember] = await db.select().from(membersTable).limit(1);
  if (!existingMember) {
    await db.insert(membersTable).values([
      { policyNo: "POL-87397", name: "Mr Sherifo Sanyang", insurer: "Horizon Health Assurance", employer: "Standard Chartered", relationship: "Principal", status: "Active", phone: "5539336", dob: "1982-04-11" },
      { policyNo: "POL-54118", name: "Miss Fatou Sambou", insurer: "Sunu Assurances", employer: "National Water & Electricity Co.", relationship: "Principal", status: "Active", phone: "2857401", dob: "1990-01-22" },
      { policyNo: "POL-83579", name: "Mr Lamin Manneh", insurer: "Sunu Assurances", employer: "National Water & Electricity Co.", relationship: "Principal", status: "Active", phone: "6521269", dob: "1978-09-03" },
      { policyNo: "POL-88172", name: "Mrs Valarie Jennifer Manneh", insurer: "Prudential Life Gambia", employer: "National Water & Electricity Co.", relationship: "Spouse", status: "Active", phone: "2532909", dob: "1980-06-14" },
      { policyNo: "POL-48469", name: "Mrs Haddy Sambou", insurer: "Horizon Health Assurance", employer: "Gam Petroleum", relationship: "Principal", status: "Active", phone: "5647075", dob: "1975-02-27" },
      { policyNo: "POL-12552", name: "Mrs Sira Mundow Jatta", insurer: "Prudential Life Gambia", employer: "Gam Petroleum", relationship: "Principal", status: "Active", phone: "2938414", dob: "1988-11-09" },
      { policyNo: "POL-19287", name: "Mr Lamin Badjie", insurer: "Continental Health Cover", employer: "GNPC", relationship: "Principal", status: "Active", phone: "6313054", dob: "1983-07-18" },
      { policyNo: "POL-24322", name: "Miss Mariama Darboe", insurer: "Continental Health Cover", employer: "Standard Chartered", relationship: "Principal", status: "Active", phone: "4085880", dob: "1992-03-30" },
      { policyNo: "POL-47388", name: "Miss Fatou Camara", insurer: "Prudential Life Gambia", employer: "Gambia Ports Authority", relationship: "Principal", status: "Active", phone: "5548443", dob: "1991-12-05" },
      { policyNo: "POL-34356", name: "Miss Virone Vatnani", insurer: "Horizon Health Assurance", employer: "Access Bank", relationship: "Principal", status: "Active", phone: "2574798", dob: "1987-08-21" },
      { policyNo: "POL-44179", name: "Mrs Varsha Badjie", insurer: "Continental Health Cover", employer: "Access Bank", relationship: "Spouse", status: "Active", phone: "3713450", dob: "1985-05-16" },
      { policyNo: "POL-54942", name: "Mr Momodou Sanyang", insurer: "Sunu Assurances", employer: "Gam Petroleum", relationship: "Principal", status: "Active", phone: "3707898", dob: "1979-10-02" },
      { policyNo: "POL-93507", name: "Mrs Fatou Vatnani", insurer: "Sunu Assurances", employer: "Gam Petroleum", relationship: "Spouse", status: "Active", phone: "4197440", dob: "1981-01-25" },
      { policyNo: "POL-99399", name: "Mr Momodou Sonko", insurer: "Sunu Assurances", employer: "Gam Petroleum", relationship: "Principal", status: "Active", phone: "4093207", dob: "1993-06-08" },
      { policyNo: "POL-39219", name: "Miss Fatou Vatnani", insurer: "Sunu Assurances", employer: "Gambia Ports Authority", relationship: "Child", status: "Active", phone: "2198511", dob: "2010-09-14" },
      { policyNo: "POL-10221", name: "Mr Ousman Njie", insurer: "Prudential Life Gambia", employer: "Standard Chartered", relationship: "Principal", status: "Active", phone: "6361407", dob: "1984-04-19" },
      { policyNo: "POL-63225", name: "Mrs Mariama Jallow", insurer: "Continental Health Cover", employer: "Access Bank", relationship: "Principal", status: "Active", phone: "6596430", dob: "1989-02-11" },
    ]);
    console.log("Seeded 17 members");
  } else {
    console.log("Members already exist, skipping");
  }

  const [existingRequest] = await db.select().from(requestsTable).limit(1);
  if (!existingRequest) {
    await db.insert(requestsTable).values([
      { type: "Remove dependent", policyNo: "POL-48469", memberName: "Mrs Haddy Sambou", insurer: "Horizon Health Assurance", stage: "Received", notes: "Exceeded age limit under policy. Formal letter to follow. Email treated as authorization." },
      { type: "Update details", policyNo: "POL-83579", memberName: "Mr Lamin Manneh", insurer: "Sunu Assurances", stage: "Reviewed", notes: "Phone number change. Member called in. New number to be confirmed with employer." },
      { type: "Add dependent", policyNo: "POL-63225", memberName: "Mrs Mariama Jallow", insurer: "Continental Health Cover", stage: "Received", notes: "New spouse to be added to policy. Marriage certificate received via email." },
    ]);
    console.log("Seeded 3 requests");
  } else {
    console.log("Requests already exist, skipping");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
