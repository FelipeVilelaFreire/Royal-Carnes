import React, { useState } from "react";
import { ChevronRightIcon } from "@foundation/ui/Icon/AppIcons";
import { Surface } from "@foundation/ui/Surface";
import { Text } from "@foundation/ui/Text";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./FaqSection.module.css";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const strings = useClientStrings().landing.faq;
  const faqs = [strings.q1, strings.q2, strings.q3];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.sectionRoot}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{strings.badge}</span>
        <Text as="h2" className={styles.title} size="size3xl" variant="h2" weight="bold">
          {strings.title}
        </Text>
      </header>

      <div className={styles.list}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <Surface className={styles.item} data-open={isOpen} key={faq.question}>
              <button className={styles.trigger} onClick={() => toggleFaq(index)} type="button">
                <Text
                  as="span"
                  className={styles.question}
                  size="sizeLg"
                  tone={isOpen ? "primary" : "text"}
                  variant="h3"
                  weight="bold"
                >
                  {faq.question}
                </Text>
                <ChevronRightIcon className={styles.chevron} size={18} />
              </button>

              <div className={styles.answerShell}>
                <div className={styles.answerInner}>
                  <Text as="p" className={styles.answer} lineHeight="lineHeightLg" size="sizeSm" tone="text-muted" variant="body">
                    {faq.answer}
                  </Text>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>
    </div>
  );
};
