"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Table, 
  Button, 
  Card, 
  Form, 
  Input, 
  DatePicker, 
  Space, 
  Modal, 
  message,
  Typography,
  Row,
  Col,
  Select
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SaveOutlined,
  CloseOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { api } from "../../lib/api";

const { Title } = Typography;
const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

type Paciente = {
  id?: number;
  historia?: string;
  nombres?: string;
  apellidos?: string;
  fecha_nacimiento?: string;
  sexo?: string;
  dpi_nit?: string;
  telefono?: string;
  email?: string;
  contacto_emergencia?: string;
  alergias?: string;
  antecedentes?: string;
  medicamentos?: string;
  fecha_registro?: string;
};

type PacienteUpdate = Partial<Paciente>;

export default function PacientesPage() {
  const [form] = Form.useForm();
  const [items, setItems] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Paciente | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const isEditing = useMemo(() => !!editing?.id, [editing]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/pacientes", { cache: "no-store" as any });
      if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
      const data = await r.json();
      setItems(data.items ?? []);
    } catch (e) {
      console.error("Error al cargar los pacientes", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  function startEdit(p: Paciente) {
    setEditing(p);
    form.setFieldsValue({
      ...p,
      fecha_nacimiento: p.fecha_nacimiento ? dayjs(p.fecha_nacimiento) : null
    });
    setModalVisible(true);
  }

  function handleAdd() {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  }

  function handleCancel() {
    setModalVisible(false);
    setEditing(null);
    form.resetFields();
  }

  async function handleSubmit() {
    try {
      const values = await form.validateFields();
      
      setFormLoading(true);
      
      const payload = {
        ...values,
        fecha_nacimiento: values.fecha_nacimiento 
          ? values.fecha_nacimiento.format('YYYY-MM-DD') 
          : undefined
      };

      if (isEditing && editing?.id) {
        await api(`/api/pacientes/${editing.id}`, { 
          method: "PUT", 
          body: JSON.stringify(payload) 
        });
        message.success("Paciente actualizado correctamente");
      } else {
        await api("/api/pacientes", { 
          method: "POST", 
          body: JSON.stringify(payload) 
        });
        message.success("Paciente creado correctamente");
      }

      handleCancel();
      await load();
    } catch (error) {
      console.error("Error al guardar paciente:", error);
    } finally {
      setFormLoading(false);
    }
  }

  async function remove(id: number) {
    Modal.confirm({
      title: "¿Eliminar paciente?",
      content: "Esta acción no se puede deshacer",
      okText: "Eliminar",
      cancelText: "Cancelar",
      okType: "danger",
      onOk: async () => {
        try {
          await api(`/api/pacientes/${id}`, { method: "DELETE" });
          message.success("Paciente eliminado correctamente");
          await load();
        } catch (error) {
          message.error("Error al eliminar el paciente");
        }
      }
    });
  }

  const columns: ColumnsType<Paciente> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Historia',
      dataIndex: 'historia',
      key: 'historia',
      render: (historia) => historia || '-',
    },
    {
      title: 'Nombres',
      dataIndex: 'nombres',
      key: 'nombres',
    },
    {
      title: 'Apellidos',
      dataIndex: 'apellidos',
      key: 'apellidos',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      render: (telefono) => telefono || '-',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '-',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => startEdit(record)}
          >
            Editar
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => record.id && remove(record.id)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Gestión de Pacientes</Title>
        
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0 }}>
              {isEditing ? "Editar Paciente" : "Lista de Pacientes"}
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Nuevo Paciente
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={items}
            rowKey="id"
            loading={loading}
            scroll={{ x: 1200 }}
            locale={{
              emptyText: "Sin registros"
            }}
          />
        </Card>
      </div>

      <Modal
        title={isEditing ? "Editar Paciente" : "Nuevo Paciente"}
        open={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={formLoading}
            onClick={handleSubmit}
            icon={isEditing ? <SaveOutlined /> : <PlusOutlined />}
          >
            {isEditing ? "Guardar" : "Crear"}
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Item
                label="Historia"
                name="historia"
              >
                <Input placeholder="Número de historia" />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="Nombres"
                name="nombres"
                rules={[{ required: true, message: 'Por favor ingrese los nombres' }]}
              >
                <Input placeholder="Ingrese nombres" />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="Apellidos"
                name="apellidos"
                rules={[{ required: true, message: 'Por favor ingrese los apellidos' }]}
              >
                <Input placeholder="Ingrese apellidos" />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Item
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="YYYY-MM-DD"
                  placeholder="Seleccione fecha"
                />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="Sexo"
                name="sexo"
              >
                <Select placeholder="Seleccione sexo">
                  <Option value="M">Masculino</Option>
                  <Option value="F">Femenino</Option>
                  <Option value="O">Otro</Option>
                </Select>
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="DPI/NIT"
                name="dpi_nit"
              >
                <Input placeholder="Ingrese DPI o NIT" />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Item
                label="Teléfono"
                name="telefono"
              >
                <Input placeholder="Ingrese teléfono" />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}
              >
                <Input placeholder="Ingrese email" />
              </Item>
            </Col>
            <Col span={8}>
              <Item
                label="Contacto Emergencia"
                name="contacto_emergencia"
              >
                <Input placeholder="Contacto de emergencia" />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Item
                label="Alergias"
                name="alergias"
              >
                <TextArea 
                  placeholder="Ingrese alergias conocidas" 
                  rows={2}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Item
                label="Antecedentes"
                name="antecedentes"
              >
                <TextArea 
                  placeholder="Ingrese antecedentes médicos" 
                  rows={2}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Item
                label="Medicamentos"
                name="medicamentos"
              >
                <TextArea 
                  placeholder="Ingrese medicamentos actuales" 
                  rows={2}
                />
              </Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}