import React from "react";
import { screen, render } from "util/test-utils";
import { MockedProvider } from "@apollo/client/testing";
import AddEditModel from "../AddEditModel";

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    push: jest.fn(),
  }),
}));

describe("<AddEditModel />", () => {
  describe("Adding Model", () => {
    it("should have a save and cancel buttons", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <AddEditModel />
        </MockedProvider>,
      );
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByText("Model Name (Ar)")).toBeInTheDocument();
      expect(screen.getByText("Model Name (En)")).toBeInTheDocument();
    });

    it("Sould have inputs for arName enName & make dropdonw", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <AddEditModel />
        </MockedProvider>,
      );
    });
  });

  describe("Adding Model localized", () => {
    it("should have a save and cancel buttons localized", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <AddEditModel />
        </MockedProvider>,
        { locale: "ar" },
      );

      expect(screen.getByRole("button", { name: /حفظ/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /إلغاء/i })).toBeInTheDocument();
      expect(screen.getByText("اسم الموديل باللغة العربية")).toBeInTheDocument();
      expect(screen.getByText("اسم الموديل باللغة الإنجليزية")).toBeInTheDocument();
    });
  });
});

describe("Editing Model", () => {
  describe("Adding Model", () => {
    it("should have a save and cancel buttons", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <AddEditModel />
        </MockedProvider>,
      );

      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });
  });
});
