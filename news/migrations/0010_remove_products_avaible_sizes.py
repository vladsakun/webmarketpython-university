# Generated by Django 2.1.5 on 2019-02-15 10:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0009_products_avaible_sizes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='products',
            name='avaible_sizes',
        ),
    ]
