import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AddUrlsObjects } from "@/app/editor/components/formComponents/addUrlsObjects";
import { UrlsTypes } from "@/models/article";

const setNewUrl = vi.fn();
const addInputs = vi.fn();
const removeInputs = vi.fn();

describe('Placing multiple inputs and test them', () => {

  it('inputs are Empty: they should render a plus and a less actionable signs to add or remove inputs', async () => {
    const screen = render(
      <AddUrlsObjects
        urls={[
          {
            type: 'website' as UrlsTypes,
            url: '',
            credits: '',
          },
        ]}
        updateUrls={setNewUrl}
        addInputs={addInputs}
        removeInputs={removeInputs}
      />
    );
    expect(screen.getByRole('combobox')).toBeDefined();
  });
});