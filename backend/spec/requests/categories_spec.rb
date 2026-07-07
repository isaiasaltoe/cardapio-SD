require 'rails_helper'

RSpec.describe "/api/v1/categories", type: :request do
  let(:admin) { create(:admin) }
  let(:headers) { auth_headers(admin) }

  let(:valid_attributes) do
    { name: "Bebidas" }
  end

  let(:invalid_attributes) do
    { name: "" }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:category, admin: admin)
      get api_v1_categories_url, headers: headers, as: :json
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      category = create(:category, admin: admin)
      get api_v1_category_url(category), headers: headers, as: :json
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Category" do
        expect {
          post api_v1_categories_url,
               params: { category: valid_attributes }, headers: headers, as: :json
        }.to change(Category, :count).by(1)
      end

      it "renders a JSON response with the new category" do
        post api_v1_categories_url,
             params: { category: valid_attributes }, headers: headers, as: :json
        puts "RESPONSE BODY: #{response.body}"
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Category" do
        expect {
          post api_v1_categories_url,
               params: { category: invalid_attributes }, headers: headers, as: :json
        }.to change(Category, :count).by(0)
      end

      it "renders a JSON response with errors for the new category" do
        post api_v1_categories_url,
             params: { category: invalid_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) do
        { name: "Sobremesas" }
      end

      it "updates the requested category" do
        category = create(:category, admin: admin)
        patch api_v1_category_url(category),
              params: { category: new_attributes }, headers: headers, as: :json
        category.reload
        expect(category.name).to eq("Sobremesas")
      end

      it "renders a JSON response with the category" do
        category = create(:category, admin: admin)
        patch api_v1_category_url(category),
              params: { category: new_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the category" do
        category = create(:category, admin: admin)
        patch api_v1_category_url(category),
              params: { category: invalid_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested category" do
      category = create(:category, admin: admin)
      expect {
        delete api_v1_category_url(category), headers: headers, as: :json
      }.to change(Category, :count).by(-1)
    end
  end
end
