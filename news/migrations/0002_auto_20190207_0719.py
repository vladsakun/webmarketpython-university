# Generated by Django 2.1.5 on 2019-02-07 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='photo2',
            field=models.TextField(default=None),
        ),
        migrations.AlterField(
            model_name='products',
            name='photo3',
            field=models.TextField(default=None),
        ),
    ]