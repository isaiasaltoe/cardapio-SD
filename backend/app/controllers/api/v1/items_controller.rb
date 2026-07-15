class Api::V1::ItemsController < ApplicationController
  before_action :authenticate_admin!, except: %i[index show]
  before_action :set_item, only: %i[ show update destroy ]

  # GET /api/v1/items
  def index
    @items = Item.all.with_attached_photo

    render json: @items.map { |item| format_item(item) }
  end

  # GET /api/v1/items/1
  def show
    render json: format_item(@item)
  end

  # POST /api/v1/items
  def create
    @item = Item.new(item_params)
    @item.admin = current_admin

    if @item.save
      render json: format_item(@item), status: :created, location: api_v1_item_url(@item)
    else
      render json: @item.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /api/v1/items/1
  def update
    if @item.update(item_params)
      render json: format_item(@item)
    else
      render json: @item.errors, status: :unprocessable_content
    end
  end

  # DELETE /api/v1/items/1
  def destroy
    @item.destroy!
  end

  private
    def format_item(item)
      item.as_json.merge(
        photo_url: item.photo.attached? ? url_for(item.photo) : nil
      )
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def item_params
      params.expect(item: [ :name, :description, :value, :category_id, :photo ])
    end
end
