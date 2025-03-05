import { UrlObjectItem } from "@/app/editor/components/formComponents/urlObjectItem";
import { UrlsTypes } from "@/models/article";
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

describe("checking rendering and data integrety", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render correctly", () => {
    const { asFragment } = render(
    <UrlObjectItem
      type={UrlsTypes.WEBSITE}
      url=""
      credits=""
      urls={[]}
      index={0}
      addUrls={() => {}}
    />
  );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should return an object filled with the correct values when 'ajouter' is clicked", () => {
    const { getByText, queryByDisplayValue } = render(
    <UrlObjectItem
      type={UrlsTypes.WEBSITE}
      url="https://example.com"
      credits="pablo"
      urls={[]}
      index={0}
      addUrls={() => {}}
    />
  );

    expect(getByText("Ajouter")).toBeDefined();
    expect(queryByDisplayValue("https://example.com")).toBeTruthy();
    expect(queryByDisplayValue("pablo")).toBeTruthy();
  });
});