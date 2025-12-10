import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { demandaService } from '../services/demandaService';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DemandasTurno: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [exames, setExames] = useState<any[]>([]);
  const [treinamentos, setTreinamentos] = useState<any[]>([]);
  const [preventivas, setPreventivas] = useState<any[]>([]);
  const [statusList, setStatusList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.supervisao?.id) {
      setLoading(false);
      return;
    }

    try {
      const hoje = format(new Date(), 'yyyy-MM-dd');
      const [statusData, examesData, treinamentosData, preventivasData] = await Promise.all([
        demandaService.getStatusDemandas(),
        demandaService.findExames(hoje, user.supervisao.id),
        demandaService.findTreinamentos(hoje, user.supervisao.id),
        demandaService.findPreventivas(hoje),
      ]);

      setStatusList(statusData);
      setExames(examesData);
      setTreinamentos(treinamentosData);
      setPreventivas(preventivasData);
    } catch (err) {
      setError('Erro ao carregar demandas (mock)');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatusExame = async (id: string, statusCodigo: string) => {
    try {
      await demandaService.updateStatusExame(id, statusCodigo);
      await loadData();
      alert('Status de exame atualizado (mock)!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar status (mock)');
    }
  };

  const handleUpdateStatusTreinamento = async (id: string, statusCodigo: string) => {
    try {
      await demandaService.updateStatusTreinamento(id, statusCodigo);
      await loadData();
      alert('Status de treinamento atualizado (mock)!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar status (mock)');
    }
  };

  const handleUpdateStatusPreventiva = async (id: string, statusCodigo: string) => {
    try {
      await demandaService.updateStatusPreventiva(id, statusCodigo);
      await loadData();
      alert('Status de preventiva atualizado (mock)!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar status (mock)');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Demandas do Turno</Typography>
        <Button variant="outlined" onClick={() => navigate('/home')}>
          Voltar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Exames Periódicos" />
          <Tab label="Treinamentos" />
          <Tab label="Preventivas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Colaborador</TableCell>
                  <TableCell>Tipo de Exame</TableCell>
                  <TableCell>Data Agendada</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exames.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum exame agendado para hoje (mock)
                    </TableCell>
                  </TableRow>
                ) : (
                  exames.map((exame) => (
                    <TableRow key={exame.id}>
                      <TableCell>{exame.colaborador.nome}</TableCell>
                      <TableCell>{exame.tipoExame}</TableCell>
                      <TableCell>
                        {format(new Date(exame.dataAgendada), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={exame.status.codigo}
                          onChange={(e) => handleUpdateStatusExame(exame.id, e.target.value)}
                        >
                          {statusList.map((status) => (
                            <MenuItem key={status.id} value={status.codigo}>
                              {status.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Colaborador</TableCell>
                  <TableCell>Treinamento</TableCell>
                  <TableCell>Data Agendada</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {treinamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhum treinamento agendado para hoje (mock)
                    </TableCell>
                  </TableRow>
                ) : (
                  treinamentos.map((treinamento) => (
                    <TableRow key={treinamento.id}>
                      <TableCell>{treinamento.colaborador.nome}</TableCell>
                      <TableCell>{treinamento.nomeTreinamento}</TableCell>
                      <TableCell>
                        {format(new Date(treinamento.dataAgendada), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={treinamento.status.codigo}
                          onChange={(e) =>
                            handleUpdateStatusTreinamento(treinamento.id, e.target.value)
                          }
                        >
                          {statusList.map((status) => (
                            <MenuItem key={status.id} value={status.codigo}>
                              {status.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Locomotiva</TableCell>
                  <TableCell>Tipo de Preventiva</TableCell>
                  <TableCell>Data Agendada</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preventivas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Nenhuma preventiva agendada para hoje (mock)
                    </TableCell>
                  </TableRow>
                ) : (
                  preventivas.map((preventiva) => (
                    <TableRow key={preventiva.id}>
                      <TableCell>{preventiva.locomotiva.numero}</TableCell>
                      <TableCell>{preventiva.tipoPreventiva}</TableCell>
                      <TableCell>
                        {format(new Date(preventiva.dataAgendada), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={preventiva.status.codigo}
                          onChange={(e) =>
                            handleUpdateStatusPreventiva(preventiva.id, e.target.value)
                          }
                        >
                          {statusList.map((status) => (
                            <MenuItem key={status.id} value={status.codigo}>
                              {status.descricao}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default DemandasTurno;
