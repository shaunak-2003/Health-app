import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/food_entries/food_entriesSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditFood_entries = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    food_image: [],

    calorie_count: '',

    fat_content: '',

    protein_content: '',

    carbohydrate_content: '',

    entry_date: new Date(),

    user: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { food_entries } = useAppSelector((state) => state.food_entries);

  const { food_entriesId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: food_entriesId }));
  }, [food_entriesId]);

  useEffect(() => {
    if (typeof food_entries === 'object') {
      setInitialValues(food_entries);
    }
  }, [food_entries]);

  useEffect(() => {
    if (typeof food_entries === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = food_entries[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [food_entries]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: food_entriesId, data }));
    await router.push('/food_entries/food_entries-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit food_entries')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit food_entries'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField>
                <Field
                  label='FoodImage'
                  color='info'
                  icon={mdiUpload}
                  path={'food_entries/food_image'}
                  name='food_image'
                  id='food_image'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField label='CalorieCount'>
                <Field
                  type='number'
                  name='calorie_count'
                  placeholder='CalorieCount'
                />
              </FormField>

              <FormField label='FatContent'>
                <Field
                  type='number'
                  name='fat_content'
                  placeholder='FatContent'
                />
              </FormField>

              <FormField label='ProteinContent'>
                <Field
                  type='number'
                  name='protein_content'
                  placeholder='ProteinContent'
                />
              </FormField>

              <FormField label='CarbohydrateContent'>
                <Field
                  type='number'
                  name='carbohydrate_content'
                  placeholder='CarbohydrateContent'
                />
              </FormField>

              <FormField label='EntryDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.entry_date
                      ? new Date(
                          dayjs(initialValues.entry_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, entry_date: date })
                  }
                />
              </FormField>

              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/food_entries/food_entries-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditFood_entries.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_FOOD_ENTRIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditFood_entries;
