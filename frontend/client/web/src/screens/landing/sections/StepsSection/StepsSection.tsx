import React from "react";
import { ScrollToAppear } from "@foundation/ui/web/ScrollToAppear/ScrollToAppear";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./StepsSection.module.css";

export const StepsSection: React.FC = () => {
  const strings = useClientStrings().landing.steps;
  const steps = [strings.step1, strings.step2, strings.step3];

  return (
    <div className={styles.sectionRoot}>
      <ScrollToAppear direction="up">
        <header className={styles.header}>
          <span className={styles.eyebrow}>{strings.badge}</span>
          <Text as="h2" className={styles.title} size="size3xl" variant="h2" weight="bold">
            {strings.title}
          </Text>
        </header>
      </ScrollToAppear>

      <div className={styles.grid}>
        {steps.map((step, index) => (
          <ScrollToAppear delayMs={index * 120} direction="up" key={step.title}>
            <Surface className={styles.card}>
              <div className={styles.stepNumber}>{step.number}</div>
              <Text as="h3" className={styles.cardTitle} size="sizeXl" variant="h3" weight="bold">
                {step.title}
              </Text>
              <Text as="p" className={styles.cardDescription} lineHeight="lineHeightLg" size="sizeSm" tone="text-muted" variant="body">
                {step.description}
              </Text>
            </Surface>
          </ScrollToAppear>
        ))}
      </div>
    </div>
  );
};
