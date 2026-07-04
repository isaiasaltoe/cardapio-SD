class ChangeValueToFloatInItems < ActiveRecord::Migration[8.1]
  def change
    change_column :items, :value, :decimal, precision: 5, scale: 2
  end
end
