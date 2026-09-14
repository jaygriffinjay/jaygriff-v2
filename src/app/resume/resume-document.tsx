import path from "path";
import { Fragment } from "react";

import {
  Document,
  Page,
  Text,
  View,
  Link,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  CONTACT,
  EDUCATION,
  EXPERIENCE,
  NAME,
  PROJECTS,
  SITE_URL,
  SKILLS,
} from "./resume-data";

/**
 * The resume as a PDF. Laid out against a fixed Letter page rather than a
 * viewport, so the output is identical everywhere — no print stylesheet, no
 * browser, nothing to differ between desktop Chrome and mobile Safari.
 *
 * Helvetica is a PDF standard-14 font, so it embeds nothing and stays
 * selectable and machine-readable for applicant tracking systems.
 */

/**
 * The wordmark font, same as the site header. Read off disk rather than over
 * HTTP: the route is force-static, so this resolves at build time when public/
 * is definitely present.
 */
Font.register({
  family: "Sekuya",
  src: path.join(process.cwd(), "public", "Sekuya-Regular.ttf"),
});

const INK = "#1c1917";
const MUTED = "#57534e";
const RULE = "#d6d3d1";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 30,
    paddingHorizontal: 42,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.38,
    color: INK,
  },

  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    borderBottomStyle: "solid",
  },
  /* own row, full width — a bare Text here shrink-wraps and the contact row
     can end up alongside it rather than beneath */
  nameRow: {
    width: "100%",
  },
  name: {
    fontSize: 26,
    fontFamily: "Sekuya",
    textAlign: "center",
    lineHeight: 1, // display size shouldn't inherit the body multiplier
  },
  /* full width on its own row, so it sits under the name rather than beside it */
  contact: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    fontSize: 8.5,
    color: MUTED,
  },
  contactLink: {
    color: INK,
    textDecoration: "none",
  },
  /* a flex sibling of the links, not nested inside one — margins on inline
     nested Text are ignored, which is what ran them all together */
  contactDot: {
    marginHorizontal: 5,
    color: MUTED,
  },

  section: {
    marginBottom: 9,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: RULE,
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  sectionLink: {
    fontSize: 8.5,
    color: MUTED,
    textDecoration: "none",
  },

  entry: {
    marginBottom: 7,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  entryTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
  },
  tagline: {
    fontFamily: "Helvetica",
    color: MUTED,
  },
  dates: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Oblique",
    color: MUTED,
  },
  honor: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Oblique",
    color: MUTED,
    marginTop: 1,
  },

  bullet: {
    flexDirection: "row",
    marginTop: 1,
    paddingRight: 8,
  },
  bulletMark: {
    width: 10,
    color: MUTED,
  },
  bulletText: {
    flex: 1,
    color: MUTED,
  },

  skillRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  skillLabel: {
    width: 82,
    fontFamily: "Helvetica-Bold",
  },
  skillItems: {
    flex: 1,
    color: MUTED,
  },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

export function ResumeDocument() {
  return (
    <Document
      title={`${NAME} — Resume`}
      author={NAME}
      subject="Full-stack developer"
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{NAME}</Text>
          </View>
          <View style={styles.contact}>
            {CONTACT.map(({ label, href }, index) => (
              <Fragment key={href}>
                {index > 0 && <Text style={styles.contactDot}>•</Text>}
                <Link src={href} style={styles.contactLink}>
                  {label}
                </Link>
              </Fragment>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <Link src={`${SITE_URL}/projects`} style={styles.sectionLink}>
              jaygriff.com/projects
            </Link>
          </View>

          {PROJECTS.map(({ name, slug, tagline, bullets }) => (
            <View key={name} style={styles.entry} wrap={false}>
              <Text style={styles.entryTitle}>
                <Link
                  src={`${SITE_URL}/projects/${slug}`}
                  style={styles.contactLink}
                >
                  {name}
                </Link>
                <Text style={styles.tagline}> — {tagline}</Text>
              </Text>
              <Bullets items={bullets} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Core Skills</Text>
            <Link src={`${SITE_URL}/my-stack`} style={styles.sectionLink}>
              jaygriff.com/my-stack
            </Link>
          </View>

          {SKILLS.map(({ label, items }) => (
            <View key={label} style={styles.skillRow}>
              <Text style={styles.skillLabel}>{label}</Text>
              <Text style={styles.skillItems}>{items}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Experience</Text>
          </View>

          {EXPERIENCE.map(({ role, org, dates, bullets }) => (
            <View key={role} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {role}
                  <Text style={styles.tagline}> — {org}</Text>
                </Text>
                <Text style={styles.dates}>{dates}</Text>
              </View>
              <Bullets items={bullets} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>

          {EDUCATION.map(({ degree, school, dates, honor }) => (
            <View key={degree} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {degree}
                  <Text style={styles.tagline}> — {school}</Text>
                </Text>
                <Text style={styles.dates}>{dates}</Text>
              </View>
              {honor && <Text style={styles.honor}>{honor}</Text>}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
