require 'rails_helper'

RSpec.describe "/api/v1/items", type: :request do
  let(:admin) { create(:admin) }
  let(:category) { create(:category, admin: admin) }
  let(:headers) { auth_headers(admin) }

  let(:valid_attributes) do
    { name: "Batata Frita", description: "Porção crocante", value: 13.50, category_id: category.id }
  end

  let(:invalid_attributes) do
    { name: "", description: nil, value: 10.0 }
  end

  describe "GET /index" do
    it "renders a successful response" do
      create(:item, admin: admin, category: category)
      get api_v1_items_url, headers: headers, as: :json
      expect(response).to be_successful
    end
  end

  describe "GET /show" do
    it "renders a successful response" do
      item = create(:item, admin: admin, category: category)
      get api_v1_item_url(item), headers: headers, as: :json
      expect(response).to be_successful
    end
  end

  describe "POST /create" do
    context "with valid parameters" do
      it "creates a new Item" do
        expect {
          post api_v1_items_url,
               params: { item: valid_attributes }, headers: headers, as: :json
        }.to change(Item, :count).by(1)
      end

      it "renders a JSON response with the new item" do
        post api_v1_items_url,
             params: { item: valid_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:created)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "does not create a new Item" do
        expect {
          post api_v1_items_url,
               params: { item: invalid_attributes }, headers: headers, as: :json
        }.to change(Item, :count).by(0)
      end

      it "renders a JSON response with errors for the new item" do
        post api_v1_items_url,
             params: { item: invalid_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "PATCH /update" do
    context "with valid parameters" do
      let(:new_attributes) do
        { name: "Batata Frita Especial", value: 18.90 }
      end

      it "updates the requested item" do
        item = create(:item, admin: admin, category: category)
        patch api_v1_item_url(item),
              params: { item: new_attributes }, headers: headers, as: :json
        item.reload
        expect(item.name).to eq("Batata Frita Especial")
        expect(item.value).to eq(18.90)
      end

      it "renders a JSON response with the item" do
        item = create(:item, admin: admin, category: category)
        patch api_v1_item_url(item),
              params: { item: new_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end

    context "with invalid parameters" do
      it "renders a JSON response with errors for the item" do
        item = create(:item, admin: admin, category: category)
        patch api_v1_item_url(item),
              params: { item: invalid_attributes }, headers: headers, as: :json
        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to match(a_string_including("application/json"))
      end
    end
  end

  describe "DELETE /destroy" do
    it "destroys the requested item" do
      item = create(:item, admin: admin, category: category)
      expect {
        delete api_v1_item_url(item), headers: headers, as: :json
      }.to change(Item, :count).by(-1)
    end
  end
end
