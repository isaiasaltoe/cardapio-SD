require 'swagger_helper'

RSpec.describe 'API V1 Categories', type: :request do
  path '/api/v1/categories' do
    get('List categories') do
      tags 'Categories'
      produces 'application/json'
      security [bearerAuth: []]

      response(200, 'successful') do
        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   name: { type: :string },
                   admin_id: { type: :integer }
                 }
               }
        
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }

        before do
          create(:category, admin: admin)
        end

        run_test!
      end
    end

    post('Create category') do
      tags 'Categories'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]

      parameter name: :category_params, in: :body, schema: {
        type: :object,
        properties: {
          category: {
            type: :object,
            properties: {
              name: { type: :string }
            },
            required: ['name']
          }
        },
        required: ['category']
      }

      response(201, 'created') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:category_params) { { category: { name: 'Bebidas' } } }
        run_test!
      end

      response(422, 'unprocessable content') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:category_params) { { category: { name: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/categories/{id}' do
    parameter name: :id, in: :path, type: :integer, required: true

    get('Show category') do
      tags 'Categories'
      produces 'application/json'
      security [bearerAuth: []]

      response(200, 'successful') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:category) { create(:category, admin: admin) }
        let(:id) { category.id }
        run_test!
      end
    end

    patch('Update category') do
      tags 'Categories'
      consumes 'application/json'
      produces 'application/json'
      security [bearerAuth: []]

      parameter name: :category_params, in: :body, schema: {
        type: :object,
        properties: {
          category: {
            type: :object,
            properties: {
              name: { type: :string }
            }
          }
        }
      }

      response(200, 'successful') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:category) { create(:category, admin: admin) }
        let(:id) { category.id }
        let(:category_params) { { category: { name: 'Sobremesas' } } }
        run_test!
      end
    end

    delete('Delete category') do
      tags 'Categories'
      produces 'application/json'
      security [bearerAuth: []]

      response(204, 'no content') do
        let(:admin) { create(:admin) }
        let(:Authorization) { auth_headers(admin)['Authorization'] }
        let(:category) { create(:category, admin: admin) }
        let(:id) { category.id }
        run_test!
      end
    end
  end
end
