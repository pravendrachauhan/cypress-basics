import "cypress-iframe";

describe("Checking Selenium Tests ", () => {
  const url = Cypress.config().baseUrl;

  it("Mouse Hover", function () {
    cy.visit(url);
    cy.get("#mousehover").invoke("show");
    cy.contains("Top").click({ force: true });
  });

  it("New Window", function () {
    cy.visit(url);
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get("#openwindow").click();
    cy.get("@windowOpen").should(
      "be.calledWith",
      "http://www.qaclickacademy.com/"
    );
    cy.window().then((win) => {
      win.location.href = "http://www.qaclickacademy.com/";
    });
    cy.go("back");
  });

  it("New Tab", function () {
    cy.visit(url);
    cy.get("#opentab").invoke("removeAttr", "target").click();
    cy.url().should("include", "https://www.rahulshettyacademy.com/");
    cy.go("back");
  });

  it("Alert", function () {
    const alertText = "pravendra";

    cy.visit(url);
    cy.get("[id=alertbtn]").click();

    cy.on("window:alert", (t) => {
      expect(t).to.contains(alertText);
    });
  });

  it("Iframe", function () {
    cy.visit(url);
    cy.frameLoaded("#courses-iframe");
    cy.iframe()
      .find("#carousel-example-generic")
      .then(function (t) {
        const frmtxt = t.text();
        expect(frmtxt).to.contains("JOIN NOW");
        cy.log(frmtxt);
      });
  });

  it("Scrollable Table", function () {
    cy.visit(url);
    cy.get("#product> tbody > tr > td:nth-child(1)").each(
      ($elm, index, $list) => {
        const t = $elm.text();
        if (t.includes("Alex")) {
          cy.get("#product > tbody > tr > td:nth-child(1)")
            .eq(index)
            .next()
            .then(function (d) {
              const r = d.text();
              expect(r).to.contains("Engineer");
            });
        }
      }
    );
  });
});
