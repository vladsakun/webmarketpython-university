# Generated by Django 2.1.5 on 2019-02-24 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0010_remove_products_avaible_sizes'),
    ]

    operations = [
        migrations.AddField(
            model_name='products',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]
