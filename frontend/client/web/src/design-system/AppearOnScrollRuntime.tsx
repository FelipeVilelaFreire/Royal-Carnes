"use client";

import React, { useEffect } from "react";

export const AppearOnScrollRuntime: React.FC = () => {
  useEffect(() => {
    document.body.classList.add("appear-runtime-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const observed = new WeakSet<Element>();
    const observeElements = () => {
      document.querySelectorAll(".appear-on-scroll").forEach((element) => {
        if (!observed.has(element)) {
          observed.add(element);
          const box = element.getBoundingClientRect();
          if (box.top < window.innerHeight && box.bottom > 0) {
            element.classList.add("appear-visible");
          }
          observer.observe(element);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      document.body.classList.remove("appear-runtime-ready");
    };
  }, []);

  return null;
};
