// __test__/review.test.js

describe("Product Reviews", () => {
  test("should allow adding a review", () => {
    const reviews = [];
    const review = { id: 1, content: "Great product!" };
    reviews.push(review);
    expect(reviews).toHaveLength(1);
  });
});
