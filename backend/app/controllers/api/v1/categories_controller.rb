class Api::V1::CategoriesController < ApplicationController
  before_action :authenticate_admin!
  before_action :set_category, only: %i[ show update destroy ]

  # GET /api/v1/categories
  def index
    @categories = Category.all

    render json: @categories
  end

  # GET /api/v1/categories/1
  def show
    render json: @category
  end

  # POST /api/v1/categories
  def create
    @category = Category.new(category_params)
    @category.admin = current_admin

    if @category.save
      render json: @category, status: :created, location: api_v1_category_url(@category)
    else
      render json: @category.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /api/v1/categories/1
  def update
    if @category.update(category_params)
      render json: @category
    else
      render json: @category.errors, status: :unprocessable_content
    end
  end

  # DELETE /api/v1/categories/1
  def destroy
    @category.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def category_params
      params.expect(category: [ :name ])
    end
end
