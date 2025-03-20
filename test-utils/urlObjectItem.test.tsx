import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { UrlObjectItem } from "@/app/editor/components/formComponents/urlObjectItem";
import { UrlsTypes } from "@/models/article";

const setNewUrl = vi.fn();

describe("checking rendering and data integrety", () => {

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

  it("inputs should be correctly filled with the provided values ", () => {
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

describe("checking rendering and data integritie", () => {

  it("should return an object filled with the correct values when 'ajouter' is clicked", () => {
    const screen = render(
      <UrlObjectItem
        type={UrlsTypes.WEBSITE}
        url=""
        credits=""
        urls={[]}
        index={0}
        addUrls={setNewUrl}
      />
    );
    act(() => {
      screen.getByText("Ajouter").click();
    });

    expect(setNewUrl).toHaveBeenCalledWith({
      type: UrlsTypes.WEBSITE,
      url: "",
      credits: "",
    },
      0
    );
  });

  it("should return the modified values and the button 'ajouter' should be now  'modifier' one", () => {
    const screen = render(
      <UrlObjectItem
        type={UrlsTypes.WEBSITE}
        url=""
        credits=""
        urls={[]}
        index={0}
        addUrls={setNewUrl}
      />
    );
    const select = screen.getByRole("combobox");
    const input1 = screen.getAllByDisplayValue("")[0];
    const input2 = screen.getAllByDisplayValue("")[1];
    act(() => {
      fireEvent.change(select, {
        target: { value: UrlsTypes.AUDIO },
      })
      fireEvent.change(input1, {
        target: { value: "https://example.com" },
      });
    });

    act(() => {
      fireEvent.change(input2, {
        target: { value: "pablo" },
      });
      screen.getByText("Ajouter").click();
    });

    expect(setNewUrl).toHaveBeenCalledWith({
        type: UrlsTypes.AUDIO,
        url: "https://example.com",
        credits: "pablo",
      },
      0
    );
  });
});
  