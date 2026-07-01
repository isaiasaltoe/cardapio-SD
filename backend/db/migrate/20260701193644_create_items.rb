class CreateItems < ActiveRecord::Migration[8.1]
  def change
    create_table :items do |t|
      t.string :name
      t.string :description
      t.integer :value

      t.timestamps
    end
  end
end
