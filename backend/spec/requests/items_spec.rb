require 'swagger_helper'

RSpec.describe 'API V1 Items', type: :request do
  path '/api/v1/items' do
    get('List items') do
      tags 'Items'
      produces 'application/json'
      security [bearerAuth: []]

      response(200, 'successful') do
        let(:admin) { create(:admin) }
        let(:category) { create(:category, admin: admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }

        before do
          create(:item, admin: admin, category: category)
        end

        run_test!
      end
    end

    post('Create item') do
      tags 'Items'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]

      parameter name: :item_params, in: :body, schema: {
        type: :object,
        properties: {
          item: {
            type: :object,
            properties: {
              name: { type: :string },
              description: { type: :string },
              value: { type: :number, format: :float },
              category_id: { type: :integer }
            },
            required: ['name', 'description']
          }
        },
        required: ['item']
      }

      response(201, 'created') do
        let(:admin) { create(:admin) }
        let(:category) { create(:category, admin: admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:item_params) do
          { item: { name: 'Batata Frita', description: 'Porção crocante', value: 13.50, category_id: category.id } }
        end
        run_test!
      end

      response(422, 'unprocessable content') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:item_params) { { item: { name: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/items/{id}' do
    parameter name: :id, in: :path, type: :integer, required: true

    get('Show item') do
      tags 'Items'
      produces 'application/json'
      security [bearerAuth: []]

      response(200, 'successful') do
        let(:admin) { create(:admin) }
        let(:category) { create(:category, admin: admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:item) { create(:item, admin: admin, category: category) }
        let(:id) { item.id }
        run_test!
      end
    end

    patch('Update item') do
      tags 'Items'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]

      parameter name: :item_params, in: :body, schema: {
        type: :object,
        properties: {
          item: {
            type: :object,
            properties: {
              name: { type: :string },
              value: { type: :number, format: :float }
            }
          }
        }
      }

      response(200, 'successful') do
        let(:admin) { create(:admin) }
        let(:category) { create(:category, admin: admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:item) { create(:item, admin: admin, category: category) }
        let(:id) { item.id }
        let(:item_params) { { item: { name: 'Batata Frita Especial', value: 18.90 } } }
        run_test!
      end
    end

    delete('Delete item') do
      tags 'Items'
      produces 'application/json'
      security [bearerAuth: []]

      response(204, 'no content') do
        let(:admin) { create(:admin) }
        let(:category) { create(:category, admin: admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:item) { create(:item, admin: admin, category: category) }
        let(:id) { item.id }
        run_test!
      end
    end
  end
end
